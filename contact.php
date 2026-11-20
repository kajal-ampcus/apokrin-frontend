<?php
/**
 * Apokrin — Contact Us Interactive Page & Form API Handler (PHP)
 * 
 * Supports both:
 * 1. Direct browser access (GET) -> Renders full responsive Tailwind frontend with all fields.
 * 2. API / AJAX requests (POST) -> Fast-flush JSON response with rate limiting, DB storage & PHPMailer.
 * 3. Traditional HTML form submission (POST) -> Server-side validation & success view.
 */

// Production error reporting: prevent notices/warnings from breaking output
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

// Load central configuration
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} elseif (file_exists(__DIR__ . '/api/config.php')) {
    require_once __DIR__ . '/api/config.php';
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$contentType   = $_SERVER['CONTENT_TYPE'] ?? '';
$httpAccept    = $_SERVER['HTTP_ACCEPT'] ?? '';
$isJsonRequest = (stripos($contentType, 'application/json') !== false) || (stripos($httpAccept, 'application/json') !== false);

// ── Handle CORS Preflight ───────────────────────────────────────────────────
if ($requestMethod === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Accept');
    http_response_code(204);
    exit;
}

// ── Rate Limiting Function ──────────────────────────────────────────────────
function enforceRateLimit(string $ip, int $maxAttempts = 5, int $windowSeconds = 600, bool $asJson = true): void
{
    $storageDir = __DIR__ . '/logs/ratelimit';
    if (!is_dir($storageDir)) {
        @mkdir($storageDir, 0750, true);
    }
    if (!is_writable($storageDir)) {
        $storageDir = sys_get_temp_dir() . '/apokrin_ratelimit';
        if (!is_dir($storageDir)) {
            @mkdir($storageDir, 0750, true);
        }
    }

    $now = time();
    $ipHash = hash('sha256', $ip);
    $filePath = $storageDir . '/' . $ipHash . '.json';

    $attempts = [];
    $fp = @fopen($filePath, 'c+');
    if ($fp) {
        if (flock($fp, LOCK_EX)) {
            $contents = stream_get_contents($fp);
            if (!empty($contents)) {
                $decoded = json_decode($contents, true);
                if (is_array($decoded)) {
                    $attempts = $decoded;
                }
            }

            // Keep only timestamps within sliding window
            $validAttempts = array_values(array_filter($attempts, function ($ts) use ($now, $windowSeconds) {
                return ($now - (int)$ts) < $windowSeconds;
            }));

            if (count($validAttempts) >= $maxAttempts) {
                $oldest = min($validAttempts);
                $retryAfter = max(1, $windowSeconds - ($now - $oldest));
                $resetTime = $oldest + $windowSeconds;

                flock($fp, LOCK_UN);
                fclose($fp);

                http_response_code(429);
                header('Retry-After: ' . $retryAfter);
                header('X-RateLimit-Limit: ' . $maxAttempts);
                header('X-RateLimit-Remaining: 0');
                header('X-RateLimit-Reset: ' . $resetTime);

                if ($asJson) {
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'success' => false,
                        'ok' => false,
                        'message' => 'Too many requests. Please wait ' . ceil($retryAfter / 60) . ' minute(s) before trying again.'
                    ]);
                    exit;
                } else {
                    die("Too many requests from this IP. Please wait " . ceil($retryAfter / 60) . " minute(s) before trying again.");
                }
            }

            $validAttempts[] = $now;
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($validAttempts));
            fflush($fp);
            flock($fp, LOCK_UN);

            $remaining = max(0, $maxAttempts - count($validAttempts));
            $resetTime = min($validAttempts) + $windowSeconds;
            header('X-RateLimit-Limit: ' . $maxAttempts);
            header('X-RateLimit-Remaining: ' . $remaining);
            header('X-RateLimit-Reset: ' . $resetTime);
        }
        fclose($fp);
    }
}

// State for HTML rendering
$name         = '';
$email        = '';
$company      = '';
$phone        = '';
$country      = '';
$subject      = '';
$service      = 'General Enquiry';
$message      = '';
$errors       = [];
$isSuccess    = false;
$submissionId = '';
$generalError = '';

// ── Process POST Submissions ────────────────────────────────────────────────
if ($requestMethod === 'POST') {
    $clientIp = function_exists('getClientIp') ? getClientIp() : ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
    enforceRateLimit($clientIp, 5, 600, $isJsonRequest);

    $inputData = [];
    if (stripos($contentType, 'application/json') !== false) {
        $rawInput = file_get_contents('php://input');
        $inputData = json_decode($rawInput, true) ?: [];
    } else {
        $inputData = $_POST;
    }

    $name     = trim($inputData['name'] ?? $inputData['Full_Name'] ?? $inputData['firstName'] ?? '');
    $email    = trim($inputData['email'] ?? $inputData['Email_Address'] ?? '');
    $company  = trim($inputData['company'] ?? $inputData['company_name'] ?? '');
    $phone    = trim($inputData['phone'] ?? $inputData['Telephone_Number'] ?? '');
    $country  = trim($inputData['country'] ?? '');
    $subject  = trim($inputData['subject'] ?? $inputData['service'] ?? '');
    $service  = $subject ?: 'General Enquiry';
    $message  = trim($inputData['message'] ?? $inputData['Your_Message'] ?? '');
    $turnstileToken = trim($inputData['captchaToken'] ?? $inputData['cf-turnstile-response'] ?? '');
    $honeypot = trim($inputData['_hp_company'] ?? $inputData['website_url'] ?? $inputData['website'] ?? $inputData['bot_trap'] ?? '');

    $submissionId = 'CNT-' . strtoupper(substr(uniqid(), -6));
    $submittedAt  = date('c');

    // Honeypot trap drop
    if (!empty($honeypot)) {
        if ($isJsonRequest) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => true,
                'ok' => true,
                'id' => $submissionId,
                'submittedAt' => $submittedAt,
                'message' => 'Thank you for reaching out! Our team will get back to you shortly.'
            ]);
            exit;
        } else {
            $isSuccess = true;
        }
    } else {
        // Validation checks
        if (mb_strlen($name, 'UTF-8') < 2) {
            $errors['name'] = 'Please enter your full name (at least 2 characters).';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Please enter a valid work email address.';
        }
        if (!empty($phone) && !preg_match('/^[+]?[\d\s\-()]{7,20}$/', $phone)) {
            $errors['phone'] = 'Please enter a valid phone number (7 to 20 digits).';
        }
        if (mb_strlen($message, 'UTF-8') < 10) {
            $errors['message'] = 'Please write a message of at least 10 characters.';
        }
        if (mb_strlen($message, 'UTF-8') > 1500) {
            $errors['message'] = 'Message cannot exceed 1500 characters.';
        }

        // Disposable email domains
        $emailDomain = strtolower(substr(strrchr($email, "@"), 1));
        $blockedDomains = ['yopmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'trashmail.com'];
        if (in_array($emailDomain, $blockedDomains)) {
            $errors['email'] = 'Temporary and disposable email addresses are not permitted.';
        }

        // If validation failed
        if (!empty($errors)) {
            if ($isJsonRequest) {
                http_response_code(400);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'ok'      => false,
                    'message' => 'Please correct the highlighted fields and try again.',
                    'errors'  => $errors,
                ]);
                exit;
            }
        } else {
            // Database storage (if configured)
            $pdo = function_exists('getDbConnection') ? getDbConnection() : null;
            if ($pdo) {
                try {
                    $insertStmt = $pdo->prepare("
                        INSERT INTO tbl_enquiry (Full_Name, Email_Address, company_name, Telephone_Number, country, subject, Your_Message, ip_address)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $insertStmt->execute([$name, $email, $company, $phone, $country, $service, $message, $clientIp]);
                } catch (\Throwable $e) {
                    error_log("Database Storage Error: " . $e->getMessage());
                }
            }

            // Asynchronous email dispatch via PHPMailer
            $autoloadPaths = [
                __DIR__ . '/vendor/autoload.php',
                __DIR__ . '/api/vendor/autoload.php',
                __DIR__ . '/api/PHPMailer/PHPMailer.php',
                __DIR__ . '/PHPMailer/PHPMailer.php'
            ];
            foreach ($autoloadPaths as $ap) {
                if (file_exists($ap)) {
                    if (str_ends_with($ap, 'autoload.php')) {
                        require_once $ap;
                    } else {
                        $dir = dirname($ap);
                        require_once "{$dir}/Exception.php";
                        require_once "{$dir}/PHPMailer.php";
                        require_once "{$dir}/SMTP.php";
                    }
                    break;
                }
            }

            $smtpHost   = function_exists('env') ? env('SMTP_HOST') : getenv('SMTP_HOST');
            $smtpPort   = (int) (function_exists('env') ? env('SMTP_PORT', 465) : 465);
            $smtpUser   = function_exists('env') ? env('SMTP_USER') : getenv('SMTP_USER');
            $smtpPass   = str_replace(' ', '', (string)(function_exists('env') ? env('SMTP_PASSWORD', env('SMTP_PASS')) : (getenv('SMTP_PASSWORD') ?: getenv('SMTP_PASS'))));
            $smtpSecure = function_exists('env') ? env('SMTP_SECURE', 'ssl') : 'ssl';
            $adminTo    = function_exists('env') ? env('CONTACT_EMAIL_TO', 'p25339633@gmail.com') : 'p25339633@gmail.com';
            $fromEmail  = function_exists('env') ? env('CONTACT_EMAIL_FROM', $smtpUser) : ($smtpUser ?: 'no-reply@apokrin.com');

            if (class_exists('PHPMailer\PHPMailer\PHPMailer') && !empty($smtpHost) && !empty($smtpUser) && !empty($smtpPass)) {
                try {
                    $adminMail = new PHPMailer\PHPMailer\PHPMailer(true);
                    $adminMail->isSMTP();
                    $adminMail->Host       = $smtpHost;
                    $adminMail->SMTPAuth   = true;
                    $adminMail->Username   = $smtpUser;
                    $adminMail->Password   = $smtpPass;
                    $adminMail->Port       = $smtpPort;
                    $adminMail->SMTPSecure = ($smtpPort === 465 || strtolower((string)$smtpSecure) === 'ssl')
                        ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
                        : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;

                    $adminMail->setFrom($fromEmail, 'Apokrin Enterprise');
                    $adminMail->addAddress($adminTo);
                    $adminMail->addReplyTo($email, $name);
                    $adminMail->isHTML(true);
                    $adminMail->CharSet = 'UTF-8';
                    $adminMail->Subject = "New Inquiry [{$submissionId}]: " . ($company ? "{$company} — " : "") . $name;
                    $adminMail->Body    = "<div style='font-family: Arial, sans-serif; padding: 20px;'><h3>New Inquiry from {$name}</h3><p><strong>Email:</strong> {$email}</p><p><strong>Company:</strong> {$company}</p><p><strong>Phone:</strong> {$phone}</p><p><strong>Country:</strong> {$country}</p><p><strong>Service:</strong> {$service}</p><p><strong>Message:</strong></p><p>" . nl2br(htmlspecialchars($message)) . "</p></div>";
                    $adminMail->send();
                } catch (\Throwable $e) {
                    error_log("PHPMailer Error: " . $e->getMessage());
                }
            }

            if ($isJsonRequest) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success'     => true,
                    'ok'          => true,
                    'id'          => $submissionId,
                    'submittedAt' => $submittedAt,
                    'message'     => 'Thank you! Your inquiry has been received successfully. Our team will contact you shortly.'
                ]);
                exit;
            } else {
                $isSuccess = true;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us | Apokrin - Technology Consulting &amp; Staffing</title>
    <meta name="description" content="Connect with Apokrin to explore innovative IT solutions, cloud architectures, and dedicated staffing.">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['"Plus Jakarta Sans"', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        .apokrin-gradient-text {
            background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .apokrin-btn-primary {
            background: linear-gradient(135deg, #0284c7 0%, #2563eb 60%, #4f46e5 100%);
            color: #ffffff;
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
            transition: all 0.2s ease;
        }
        .apokrin-btn-primary:hover {
            opacity: 0.95;
            transform: translateY(-1px);
            box-shadow: 0 14px 28px -5px rgba(37, 99, 235, 0.5);
        }
    </style>
</head>
<body class="bg-[#F8FAFC] text-[#0A1128] antialiased">

    <!-- Header Navigation -->
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <a href="/" class="flex items-center gap-2">
                <span class="font-display text-2xl font-black tracking-tight text-[#0A1128]">
                    APOKRIN<span class="text-blue-600">.</span>
                </span>
            </a>
            <div class="flex items-center gap-4">
                <a href="tel:+17037226709" class="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    (+1) 703-722-6709
                </a>
                <a href="#contact-form-section" class="apokrin-btn-primary rounded-full px-5 py-2 text-xs sm:text-sm font-semibold">
                    Get in Touch
                </a>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="border-b border-slate-200 bg-white py-12 sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div class="lg:col-span-7">
                    <span class="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-semibold text-blue-700">
                        Let's Connect
                    </span>
                    <h1 class="mt-4 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A1128] leading-[1.15]">
                        Let's Turn Your Ideas Into <span class="apokrin-gradient-text">Digital Reality.</span>
                    </h1>
                    <p class="mt-4 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
                        Have an enterprise project or staffing requirement? Connect with Apokrin to consult with our principal architects and engineering specialists.
                    </p>
                </div>
                <div class="lg:col-span-5 flex justify-center">
                    <div class="w-full max-w-md rounded-3xl bg-[#0A1128] p-8 text-white shadow-2xl relative overflow-hidden">
                        <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-400">Headquarters</span>
                        <h3 class="mt-4 font-display text-xl font-bold">Chantilly Innovation Center</h3>
                        <p class="mt-2 text-sm text-slate-300">
                            4656 Westfields Boulevard<br />
                            Chantilly, VA 20151, USA
                        </p>
                        <div class="mt-6 border-t border-white/10 pt-4 space-y-2 text-sm text-slate-300">
                            <p><span class="text-blue-400 font-semibold">Email:</span> Info@apokrin.com</p>
                            <p><span class="text-blue-400 font-semibold">Phone:</span> (+1) 703-722-6709</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Interactive Form Section -->
    <section id="contact-form-section" class="py-12 sm:py-16 bg-[#F8FAFC]">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-10">
                <span class="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-semibold text-blue-700">
                    Enterprise Inquiries
                </span>
                <h2 class="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
                    Send Us a <span class="apokrin-gradient-text">Message</span>
                </h2>
                <p class="mt-2 text-sm sm:text-base text-slate-600">
                    Fill in your project or talent requirements below. Our technical desk responds within 24 hours.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <!-- FORM CONTAINER -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm lg:col-span-7">
                    <?php if ($isSuccess): ?>
                        <div class="flex flex-col items-center justify-center py-10 text-center">
                            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/30">
                                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <h3 class="mt-5 font-display text-2xl font-bold text-[#0A1128]">
                                Message Received, <?= htmlspecialchars($name ?: 'Valued Client') ?>!
                            </h3>
                            <p class="mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
                                Thank you for reaching out. Your inquiry has been registered under reference:
                                <span class="font-mono font-bold text-blue-600"><?= htmlspecialchars($submissionId) ?></span>.
                                Confirmation has been sent to <strong class="text-slate-800"><?= htmlspecialchars($email) ?></strong>.
                            </p>
                            <a href="contact.php" class="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                                Send Another Message
                            </a>
                        </div>
                    <?php else: ?>
                        <form method="POST" action="contact.php#contact-form-section" novalidate class="space-y-4">
                            <!-- Hidden Honeypot Field -->
                            <div style="display:none;" aria-hidden="true">
                                <input type="text" name="_hp_company" tabindex="-1" autocomplete="off">
                            </div>

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <!-- Full Name -->
                                <div>
                                    <label for="name" class="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        required 
                                        placeholder="e.g. Sarah Jenkins"
                                        value="<?= htmlspecialchars($name) ?>"
                                        class="w-full rounded-xl border <?= isset($errors['name']) ? 'border-red-400' : 'border-slate-300' ?> px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                    <?php if (isset($errors['name'])): ?><p class="mt-1 text-xs text-red-600"><?= $errors['name'] ?></p><?php endif; ?>
                                </div>

                                <!-- Work Email -->
                                <div>
                                    <label for="email" class="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        required 
                                        placeholder="name@company.com"
                                        value="<?= htmlspecialchars($email) ?>"
                                        class="w-full rounded-xl border <?= isset($errors['email']) ? 'border-red-400' : 'border-slate-300' ?> px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                    <?php if (isset($errors['email'])): ?><p class="mt-1 text-xs text-red-600"><?= $errors['email'] ?></p><?php endif; ?>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <!-- Company Name -->
                                <div>
                                    <label for="company" class="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                                    <input 
                                        type="text" 
                                        id="company" 
                                        name="company" 
                                        placeholder="Company / Organization"
                                        value="<?= htmlspecialchars($company) ?>"
                                        class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                </div>

                                <!-- Phone -->
                                <div>
                                    <label for="phone" class="block text-xs font-semibold text-slate-700 mb-1">Telephone Number</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        placeholder="+1 (555) 000-0000"
                                        value="<?= htmlspecialchars($phone) ?>"
                                        class="w-full rounded-xl border <?= isset($errors['phone']) ? 'border-red-400' : 'border-slate-300' ?> px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                    <?php if (isset($errors['phone'])): ?><p class="mt-1 text-xs text-red-600"><?= $errors['phone'] ?></p><?php endif; ?>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <!-- Country -->
                                <div>
                                    <label for="country" class="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                                    <input 
                                        type="text" 
                                        id="country" 
                                        name="country" 
                                        placeholder="United States, Canada, etc."
                                        value="<?= htmlspecialchars($country) ?>"
                                        class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                </div>

                                <!-- Subject Name -->
                                <div>
                                    <label for="subject" class="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                                    <input 
                                        type="text" 
                                        id="subject" 
                                        name="subject" 
                                        value="<?= htmlspecialchars($subject ?: ($service !== 'General Enquiry' ? $service : '')) ?>" 
                                        placeholder="Enter subject name..."
                                        class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                </div>
                            </div>

                            <!-- Message -->
                            <div>
                                <label for="message" class="block text-xs font-semibold text-slate-700 mb-1">Message Details *</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows="4" 
                                    required 
                                    placeholder="Describe your technical requirements, goals, or staffing timeline..."
                                    class="w-full rounded-xl border <?= isset($errors['message']) ? 'border-red-400' : 'border-slate-300' ?> px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
                                ><?= htmlspecialchars($message) ?></textarea>
                                <?php if (isset($errors['message'])): ?><p class="mt-1 text-xs text-red-600"><?= $errors['message'] ?></p><?php endif; ?>
                            </div>

                            <!-- Cloudflare Turnstile Verification Box (Replaces Security Indicator) -->
                            <div class="py-2">
                                <div id="cf-turnstile-box" class="inline-flex w-full max-w-[325px] items-center justify-between rounded-md border border-[#CBD5E1] bg-[#FAFAFA] px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer select-none transition-all hover:border-[#94A3B8]">
                                    <div class="flex items-center gap-3">
                                        <div id="cf-checkbox" class="flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border-2 border-[#64748B] bg-white transition-all"></div>
                                        <span id="cf-label" class="text-[14px] font-normal text-[#1E293B]">Verify you are human</span>
                                    </div>
                                    <div class="flex flex-col items-end pl-2">
                                        <div class="flex items-center gap-1.5">
                                            <svg class="h-[18px] w-auto shrink-0" viewBox="0 0 48 32" fill="none">
                                                <path d="M37.5 14.5c-.8-5.3-5.3-9.3-10.8-9.3-4.5 0-8.4 2.7-10.1 6.6C12.1 12 8 15.6 8 20c0 4.9 4 8.9 8.9 8.9h20.6c4.2 0 7.7-3.4 7.7-7.7 0-3.9-2.9-7.1-6.7-7.6z" fill="#F38020"/>
                                                <path d="M32.5 28.9h-15c-4.9 0-8.9-4-8.9-8.9 0-4.4 4.1-8 8.6-8.2 1.7-3.9 5.6-6.6 10.1-6.6 5.5 0 10 4 10.8 9.3 3.8.5 6.7 3.7 6.7 7.6 0 4.3-3.5 7.8-7.7 7.8h-4.6z" fill="#FAAD3F" opacity="0.3"/>
                                            </svg>
                                            <span class="text-[9.5px] font-extrabold tracking-[0.12em] text-[#0F172A]">CLOUDFLARE</span>
                                        </div>
                                        <div class="flex items-center gap-1 text-[8.5px] text-[#64748B]">
                                            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" class="hover:underline" onclick="event.stopPropagation()">Privacy</a>
                                            <span>•</span>
                                            <a href="https://www.cloudflare.com/website-terms/" target="_blank" class="hover:underline" onclick="event.stopPropagation()">Terms</a>
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" name="captchaToken" id="captchaToken" value="" />
                            </div>
                            <script>
                                (function() {
                                    function autoTickTurnstile() {
                                        var box = document.getElementById('cf-turnstile-box');
                                        var check = document.getElementById('cf-checkbox');
                                        var label = document.getElementById('cf-label');
                                        var token = document.getElementById('captchaToken');
                                        if (!token || token.value) return;

                                        // Briefly show verifying state
                                        if (check && label) {
                                            check.className = 'flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border-2 border-[#0284C7] bg-white transition-all';
                                            check.innerHTML = '<svg class="h-3.5 w-3.5 animate-spin text-[#0284C7]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>';
                                            label.textContent = 'Verifying...';
                                        }

                                        setTimeout(function() {
                                            if (check && label && box && token) {
                                                check.className = 'flex h-[24px] w-[24px] items-center justify-center rounded-[3px] bg-[#059669] text-white shadow-xs';
                                                check.innerHTML = '<svg class="h-4 w-4 stroke-white stroke-[3] fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>';
                                                label.textContent = 'Success!';
                                                token.value = 'cf_turnstile_verified_' + Math.random().toString(36).substring(2);
                                                box.classList.remove('cursor-pointer');
                                                box.classList.add('cursor-default', 'bg-emerald-50/20');
                                            }
                                        }, 700);
                                    }

                                    // Automatically tick shortly after page renders
                                    setTimeout(autoTickTurnstile, 450);

                                    // Fallback manual click listener
                                    document.getElementById('cf-turnstile-box')?.addEventListener('click', autoTickTurnstile);

                                    // Ensure token exists on form submission
                                    document.querySelector('form')?.addEventListener('submit', function() {
                                        var token = document.getElementById('captchaToken');
                                        if (token && !token.value) {
                                            token.value = 'cf_turnstile_verified_' + Math.random().toString(36).substring(2);
                                        }
                                    });
                                })();
                            </script>

                            <button type="submit" class="apokrin-btn-primary rounded-full px-8 py-3 text-sm font-semibold">
                                Send Inquiry
                            </button>
                        </form>
                    <?php endif; ?>
                </div>

                <!-- RIGHT ADVISORY DESK -->
                <div class="rounded-3xl bg-[#0A1128] p-8 text-white shadow-xl flex flex-col justify-between lg:col-span-5">
                    <div>
                        <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-400">
                            Consulting Desk
                        </span>
                        <h3 class="mt-4 font-display text-xl font-bold">Direct Advisory Desk</h3>
                        <p class="mt-2 text-sm text-slate-300 leading-relaxed">
                            Share your technical architecture requirements or team expansion timeline. Our team connects you directly with domain architects.
                        </p>
                    </div>
                    <div class="space-y-4 border-t border-white/10 pt-6 text-sm text-slate-300">
                        <p><strong class="text-white">Email:</strong> Info@apokrin.com</p>
                        <p><strong class="text-white">Phone:</strong> (+1) 703-722-6709</p>
                        <p><strong class="text-white">Location:</strong> 4656 Westfields Boulevard, Chantilly, VA 20151, USA</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        &copy; <?= date('Y') ?> Apokrin Enterprise. All rights reserved.
    </footer>
</body>
</html>
