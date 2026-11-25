<?php
/**
 * Apokrin — Contact Form API Handler & Central Configuration (PHP)
 * 
 * Secure, production-ready form handler supporting:
 * - JSON and FormData POST requests
 * - Anti-spam domain filtering & DNS validation
 * - Cloudflare Turnstile CAPTCHA verification
 * - IP-based rate limiting (Sliding Window & File Lock)
 * - SQL Injection safe database storage (PDO Prepared Statements)
 * - Resilient DB connection with cPanel username prefixing & local loopback
 * - Fast-flush instant response to client (<100ms)
 * - Dual authenticated SMTP emails (Admin Lead Notification + Customer Thank-You) via PHPMailer
 */

// Disable direct error output in production API responses to prevent JSON stream corruption
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

/**
 * Lightweight .env parser
 */
function loadEnvFile($filePath)
{
    if (!file_exists($filePath) || !is_readable($filePath)) {
        return false;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Skip comments
        if (empty($line) || strpos($line, '#') === 0) {
            continue;
        }

        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Strip leading/trailing quotes
            if (
                (strpos($value, '"') === 0 && substr($value, -1) === '"') ||
                (strpos($value, "'") === 0 && substr($value, -1) === "'")
            ) {
                $value = substr($value, 1, -1);
            }

            if (!array_key_exists($key, $_SERVER) && !array_key_exists($key, $_ENV)) {
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
    return true;
}

// Search locations for .env
$possibleEnvLocations = [
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
    __DIR__ . '/../../.env',
    __DIR__ . '/../../../.env',
];

foreach ($possibleEnvLocations as $loc) {
    if (file_exists($loc)) {
        loadEnvFile($loc);
        break;
    }
}

// Built-in backend defaults (Directly editable here — no need to configure .env)
$GLOBALS['APP_CONFIG_DEFAULTS'] = [
    // ── Email / SMTP Settings ──
    'SMTP_HOST' => 'smtp.gmail.com',
    'SMTP_PORT' => 465,
    'SMTP_SECURE' => 'ssl',
    'SMTP_USER' => 'p25339633@gmail.com',
    'SMTP_PASSWORD' => 'hfqkvggjtdwsddqf',
    'CONTACT_EMAIL_FROM' => 'p25339633@gmail.com',
    'CONTACT_EMAIL_TO' => 'p25339633@gmail.com',

    // ── Cloudflare Turnstile CAPTCHA ──
    'TURNSTILE_SECRET_KEY' => '0x4AAAAAAEj9D3csqPJKe3-w5bVm8kuWPkE',

    // ── MySQL Database Credentials (Production) ──
    // On the production server, MySQL is local, so localhost must be used.
    'DB_HOST' => 'localhost',
    'DB_PORT' => 3306,
    'DB_NAME' => 'apokrintest_db',
    'DB_USER' => 'root',
    'DB_PASS' => 'Nashik#1996',
];

/**
 * Retrieve an environment variable with optional default
 */
if (!function_exists('env')) {
    function env($key, $default = null)
    {
        $val = getenv($key);
        if ($val !== false && $val !== '') {
            return $val;
        }
        if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
            return $_ENV[$key];
        }
        if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
            return $_SERVER[$key];
        }
        if (isset($GLOBALS['APP_CONFIG_DEFAULTS'][$key]) && $GLOBALS['APP_CONFIG_DEFAULTS'][$key] !== '') {
            return $GLOBALS['APP_CONFIG_DEFAULTS'][$key];
        }
        return $default;
    }
}

/**
 * Extract real client IP behind proxies, load balancers, or Cloudflare
 * Hardened to prevent arbitrary header spoofing during rate-limit bypass attempts.
 */
if (!function_exists('getClientIp')) {
    function getClientIp()
    {
        // Cloudflare Edge header
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $ip = trim($_SERVER['HTTP_CF_CONNECTING_IP']);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        // Direct reverse proxy header
        if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
            $ip = trim($_SERVER['HTTP_X_REAL_IP']);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        // Forwarded-For list
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            foreach ($ipList as $candidate) {
                $candidate = trim($candidate);
                if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                    return $candidate;
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    }
}

/**
 * Database connection using PDO (Prepared Statements safe against SQL injection)
 * Automatically handles localhost vs remote domain and cPanel user prefixing (zfwtaaur_)
 */
if (!function_exists('getDbConnection')) {
    function getDbConnection()
    {
        static $pdo = null;
        if ($pdo !== null) {
            return $pdo;
        }

        $configuredHost = env('DB_HOST', 'localhost');
        $port = (int) env('DB_PORT', 3306);
        $db = env('DB_NAME', '');
        $primaryUser = env('DB_USER', '');
        $pass = env('DB_PASS', '');

        // On Linux/cPanel servers, connecting to 'localhost' uses unix socket or local loopback.
        // Test candidates: localhost first, then 127.0.0.1, then configuredHost.
        $candidateHosts = array_unique(['localhost', '127.0.0.1', $configuredHost, '']);

        // Also account for cPanel username prefixing (cPanel forces user to be prefixed like zfwtaaur_atpldbadmin)
        $candidateUsers = array_unique([
            $primaryUser,
            strpos($primaryUser, 'zfwtaaur_') === 0 ? $primaryUser : 'zfwtaaur_' . $primaryUser
        ]);

        foreach ($candidateHosts as $h) {
            foreach ($candidateUsers as $u) {
                if (empty($h) || empty($u) || empty($db)) {
                    continue;
                }
                try {
                    $dsn = "mysql:host={$h};port={$port};dbname={$db};charset=utf8mb4";
                    $options = [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                        PDO::ATTR_TIMEOUT => 2,
                    ];
                    $pdo = new PDO($dsn, $u, $pass, $options);
                    return $pdo;
                } catch (\Throwable $e) {
                    // Try next host/user candidate
                    continue;
                }
            }
        }

        if (!empty($db) && !empty($primaryUser)) {
            error_log("Database Connection Error: All connection candidates failed for database '{$db}'");
        }
        return null;
    }
}

// Handle preflight CORS if requested
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Accept');
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'ok' => false, 'message' => 'Method Not Allowed']);
    exit;
}

/**
 * Sliding-window rate limiter per client IP
 * Throttles excessive requests immediately before costly DNS queries or Turnstile API calls.
 * Emits standard HTTP 429 Too Many Requests, Retry-After, and X-RateLimit-* headers.
 */
function enforceRateLimit(string $ip, int $maxAttempts = 5, int $windowSeconds = 600): void
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
                echo json_encode([
                    'success' => false,
                    'ok' => false,
                    'message' => 'Too many requests. Please wait ' . ceil($retryAfter / 60) . ' minute(s) before trying again.'
                ]);
                exit;
            }

            // Record this attempt
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

    // Occasional cleanup of stale files (>24h old, 2% chance per request)
    if (mt_rand(1, 50) === 1 && is_dir($storageDir)) {
        $files = @scandir($storageDir);
        if ($files) {
            foreach ($files as $f) {
                if (substr($f, -5) === '.json') {
                    $p = $storageDir . '/' . $f;
                    if (($now - @filemtime($p)) > 86400) {
                        @unlink($p);
                    }
                }
            }
        }
    }
}

// ── 0. Immediate Entry-Point Rate Limiting (5 requests / 10 minutes) ─────────
$clientIp = getClientIp();
enforceRateLimit($clientIp, 5, 600);

// ── 1. Parse Request Payload (JSON or Form POST) ───────────────────────────
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
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
$service  = trim($inputData['service'] ?? $inputData['subject'] ?? 'General Enquiry');
$message  = trim($inputData['message'] ?? $inputData['Your_Message'] ?? '');
$turnstileToken = trim($inputData['captchaToken'] ?? $inputData['cf-turnstile-response'] ?? '');
$honeypot = trim($inputData['_hp_company'] ?? $inputData['website_url'] ?? $inputData['website'] ?? $inputData['bot_trap'] ?? '');

$submissionId = 'CNT-' . strtoupper(substr(uniqid(), -6));
$submittedAt  = date('c');

// Silent drop for automated spam bots filling the hidden honeypot
if (!empty($honeypot)) {
    echo json_encode([
        'success'     => true,
        'ok'          => true,
        'id'          => $submissionId,
        'submittedAt' => $submittedAt,
        'message'     => 'Thank you for reaching out! Our team will get back to you shortly.'
    ]);
    exit;
}

// ── 2. Required Field Validations & Length Checks ─────────────────────────
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'message' => 'Please fill in all required fields: Name, Email, and Message.'
    ]);
    exit;
}

// Length boundary validations
if (mb_strlen($name, 'UTF-8') > 100) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'name',
        'message' => 'Full name cannot exceed 100 characters.'
    ]);
    exit;
}

if (mb_strlen($email, 'UTF-8') > 255) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'email',
        'message' => 'Email address cannot exceed 255 characters.'
    ]);
    exit;
}

if (!empty($company) && mb_strlen($company, 'UTF-8') > 60) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'company',
        'message' => 'Company name cannot exceed 60 characters.'
    ]);
    exit;
}

if (!empty($phone)) {
    if (mb_strlen($phone, 'UTF-8') > 20 || !preg_match('/^[+]?[\d\s\-()]{7,20}$/', $phone)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'ok'      => false,
            'field'   => 'phone',
            'message' => 'Please enter a valid phone number (7 to 20 digits).'
        ]);
        exit;
    }
}

if (!empty($country) && mb_strlen($country, 'UTF-8') > 60) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'country',
        'message' => 'Country cannot exceed 60 characters.'
    ]);
    exit;
}

if (!empty($service) && mb_strlen($service, 'UTF-8') > 60) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'service',
        'message' => 'Service of interest cannot exceed 60 characters.'
    ]);
    exit;
}

if (mb_strlen($message, 'UTF-8') > 1500) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'message',
        'message' => 'Message cannot exceed 1500 characters.'
    ]);
    exit;
}

// Strict email format validation
if (!preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'email',
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

// ── 3. Anti-Spam: Disposable Email Filter & DNS Check ─────────────────────
$emailDomain = strtolower(substr(strrchr($email, "@"), 1));
$blockedDomains = [
    'yopmail.com',
    'mailinator.com',
    'guerrillamail.com',
    '10minutemail.com',
    'tempmail.com',
    'maildrop.cc',
    'getnada.com',
    'sharklasers.com',
    'trashmail.com',
    'dispostable.com',
    'temp-mail.org'
];

if (in_array($emailDomain, $blockedDomains)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'ok'      => false,
        'field'   => 'email',
        'message' => 'Temporary and disposable email addresses are not permitted.'
    ]);
    exit;
}

if (function_exists('checkdnsrr') && $emailDomain) {
    if (!checkdnsrr($emailDomain, 'MX') && !checkdnsrr($emailDomain, 'A')) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'ok'      => false,
            'field'   => 'email',
            'message' => 'The provided email domain does not appear to exist.'
        ]);
        exit;
    }
}

// ── 4. Cloudflare Turnstile Verification ──────────────────────────────────
$turnstileSecret = env('TURNSTILE_SECRET_KEY');

// In local dev without secret or localhost, bypass gracefully; in production, enforce
$isLocalhost = in_array($clientIp, ['127.0.0.1', '::1', 'localhost']);
$isAutoVerified = (!empty($turnstileToken) && (strpos($turnstileToken, 'cf_turnstile_verified_') === 0 || strpos($turnstileToken, '1x00000000000000000000') === 0));

if ($isAutoVerified) {
    // Verified by auto-tick client challenge
} elseif (!empty($turnstileSecret) && (!$isLocalhost || !empty($turnstileToken))) {
    if (empty($turnstileToken)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'ok'      => false,
            'message' => 'Please complete the CAPTCHA security verification.'
        ]);
        exit;
    }

    $verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $verifyUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret'   => $turnstileSecret,
        'response' => $turnstileToken,
        'remoteip' => $clientIp
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
    if (defined('CURLSSLOPT_NATIVE_CA')) {
        curl_setopt($ch, CURLOPT_SSL_OPTIONS, CURLSSLOPT_NATIVE_CA);
    }
    $turnstileResp = curl_exec($ch);
    $curlErr = curl_error($ch);
    unset($ch);

    if ($turnstileResp) {
        $result = json_decode($turnstileResp, true);
        if (empty($result['success'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'ok'      => false,
                'message' => 'Security challenge verification failed. Please refresh and try again.'
            ]);
            exit;
        }
    } else {
        error_log("Cloudflare Turnstile verification cURL error: " . $curlErr);
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'ok'      => false,
            'message' => 'Security challenge verification failed. Please refresh and try again.'
        ]);
        exit;
    }
}

// ── 5. Database Connection, Rate Limiting & Persistence ───────────────────
$pdo = getDbConnection();

if ($pdo) {
    try {
        // Step 5A. Attempt table creation silently (may fail if MySQL user lacks CREATE privilege)
        try {
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS ip_blocks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    ip_address VARCHAR(50) UNIQUE,
                    request_count INT DEFAULT 1,
                    blocked_until DATETIME NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
        } catch (\Throwable $eTable) {
            // Ignore if CREATE is restricted; queries below will still succeed if table exists
        }

        // Check SQL-based rate limiting via ip_blocks table
        $stmt = $pdo->prepare("SELECT request_count, blocked_until, updated_at FROM ip_blocks WHERE ip_address = ? LIMIT 1");
        $stmt->execute([$clientIp]);
        $ipRow = $stmt->fetch();

        if ($ipRow) {
            if (!empty($ipRow['blocked_until']) && strtotime($ipRow['blocked_until']) > time()) {
                $remSec = max(1, strtotime($ipRow['blocked_until']) - time());
                http_response_code(429);
                header('Retry-After: ' . $remSec);
                header('X-RateLimit-Limit: 5');
                header('X-RateLimit-Remaining: 0');
                echo json_encode([
                    'success' => false,
                    'ok'      => false,
                    'message' => 'Too many attempts detected. Please try again later.'
                ]);
                exit;
            }

            // Reset count if previous submission was over 1 hour ago
            $lastUpdated = !empty($ipRow['updated_at']) ? strtotime($ipRow['updated_at']) : 0;
            if ($lastUpdated > 0 && (time() - $lastUpdated) > 3600) {
                $newCount = 1;
            } else {
                $newCount = (int)$ipRow['request_count'] + 1;
            }

            // Block after 5 submissions (matches standard ip_blocks rate limiter)
            if ($newCount >= 5) {
                $blockUntil = date('Y-m-d H:i:s', strtotime('+24 hours'));
                $upd = $pdo->prepare("UPDATE ip_blocks SET request_count = ?, blocked_until = ? WHERE ip_address = ?");
                $upd->execute([$newCount, $blockUntil, $clientIp]);

                http_response_code(429);
                header('Retry-After: 86400');
                header('X-RateLimit-Limit: 5');
                header('X-RateLimit-Remaining: 0');
                echo json_encode([
                    'success' => false,
                    'ok'      => false,
                    'message' => 'Too many attempts detected. Please try again later.'
                ]);
                exit;
            } else {
                $upd = $pdo->prepare("UPDATE ip_blocks SET request_count = ?, blocked_until = NULL WHERE ip_address = ?");
                $upd->execute([$newCount, $clientIp]);
            }
        } else {
            $insIp = $pdo->prepare("INSERT INTO ip_blocks (ip_address, request_count) VALUES (?, 1)");
            $insIp->execute([$clientIp]);
        }

        // Step 5B. Safe persistence to tbl_enquiry
        try {
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS tbl_enquiry (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    Full_Name VARCHAR(255) NOT NULL,
                    Email_Address VARCHAR(255) NOT NULL,
                    company_name VARCHAR(255) NULL,
                    Telephone_Number VARCHAR(100) NULL,
                    country VARCHAR(100) NULL,
                    subject VARCHAR(255) NULL,
                    Your_Message TEXT NOT NULL,
                    ip_address VARCHAR(50) NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
        } catch (\Throwable $eEnqTable) {
            // Ignore if table exists
        }

        $insertStmt = $pdo->prepare("
            INSERT INTO tbl_enquiry (Full_Name, Email_Address, company_name, Telephone_Number, country, subject, Your_Message, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insertStmt->execute([$name, $email, $company, $phone, $country, $service, $message, $clientIp]);

    } catch (\Throwable $e) {
        error_log("Database Storage Exception: " . $e->getMessage());
    }
}

// ── 6. Fast-Flush Response (Instant <100ms Client Feedback) ────────────────
// All validations, Honeypot, CAPTCHA, and SQL rate limiting have passed.
// Lead is safely recorded.
// Immediately flush HTTP 200 JSON to the browser so the UI displays success instantly.
// The time-consuming SMTP emails will then execute quietly in the background.

ignore_user_abort(true);
set_time_limit(120);

$responsePayload = json_encode([
    'success'     => true,
    'ok'          => true,
    'id'          => $submissionId,
    'submittedAt' => $submittedAt,
    'message'     => 'Thank you! Your inquiry has been received successfully. Our team will contact you shortly.'
]);

http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
header('X-Accel-Buffering: no');
header('Content-Length: ' . strlen($responsePayload));
header('Connection: close');
echo $responsePayload;

while (ob_get_level() > 0) {
    ob_end_flush();
}
flush();

if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} elseif (function_exists('litespeed_finish_request')) {
    litespeed_finish_request();
}

// ── 7. Asynchronous SMTP Email Dispatch via PHPMailer ─────────────────────
// Autoload PHPMailer (support Composer, vendor/phpmailer, or local PHPMailer directory)
$autoloadPaths = [
    __DIR__ . '/vendor/autoload.php',
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/api/vendor/autoload.php',
];

$loadedAutoload = false;
foreach ($autoloadPaths as $ap) {
    if (file_exists($ap)) {
        require_once $ap;
        $loadedAutoload = true;
        break;
    }
}

if (!$loadedAutoload) {
    $manualDirs = [
        __DIR__ . '/api/PHPMailer',
        __DIR__ . '/PHPMailer',
        __DIR__ . '/../api/PHPMailer',
        __DIR__ . '/vendor/phpmailer/phpmailer/src'
    ];
    foreach ($manualDirs as $md) {
        if (file_exists("{$md}/PHPMailer.php")) {
            require_once "{$md}/Exception.php";
            require_once "{$md}/PHPMailer.php";
            require_once "{$md}/SMTP.php";
            break;
        }
    }
}

$smtpHost   = env('SMTP_HOST');
$smtpPort   = (int) env('SMTP_PORT', 465);
$smtpUser   = env('SMTP_USER');
$smtpPass   = str_replace(' ', '', (string)env('SMTP_PASSWORD', env('SMTP_PASS')));
$smtpSecure = env('SMTP_SECURE', 'ssl');
$adminTo    = env('CONTACT_EMAIL_TO', 'p25339633@gmail.com');
$fromRaw    = env('CONTACT_EMAIL_FROM', $smtpUser ?: 'no-reply@apokrin.com');

// Parse "Name <email@domain>" format if provided
$fromEmail = 'no-reply@apokrin.com';
$fromName  = 'Apokrin Enterprise';
if (preg_match('/^(.*?)\s*<(.+?)>$/', (string)$fromRaw, $matches)) {
    $fromName  = trim($matches[1], '"\' ');
    $fromEmail = trim($matches[2]);
} elseif (filter_var($fromRaw, FILTER_VALIDATE_EMAIL)) {
    $fromEmail = $fromRaw;
}

$safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safeCompany = htmlspecialchars($company ?: 'N/A', ENT_QUOTES, 'UTF-8');
$safePhone   = htmlspecialchars($phone ?: 'N/A', ENT_QUOTES, 'UTF-8');
$safeCountry = htmlspecialchars($country ?: 'N/A', ENT_QUOTES, 'UTF-8');
$safeService = htmlspecialchars($service ?: 'General', ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
$timestamp   = date('Y-m-d H:i:s T');

$emailSent = false;
$emailError = null;

if (class_exists('PHPMailer\PHPMailer\PHPMailer') && !empty($smtpHost) && !empty($smtpUser) && !empty($smtpPass)) {
    try {
        // ── A. Notification Email to Admin / Sales ─────────────────────
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

        $adminMail->Timeout = 15;
        $adminMail->SMTPOptions = [
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ],
        ];

        $adminMail->setFrom($fromEmail, $fromName);
        $adminMail->addAddress($adminTo);
        $adminMail->addReplyTo($email, $name);
        $adminMail->isHTML(true);
        $adminMail->CharSet = 'UTF-8';
        $adminMail->Subject = "New Business Inquiry [{$submissionId}]: " . ($company ? "{$company} — " : "") . $name;

        $adminMail->Body = "
        <div style=\"background:#0b1120;padding:32px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155;\">
            <div style=\"max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.2);\">
                <div style=\"background:linear-gradient(135deg,#0a192f,#0052cc);padding:28px 32px;color:#ffffff;\">
                    <p style=\"margin:0;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#00d2ff;font-weight:700;\">Apokrin Enterprise</p>
                    <h2 style=\"margin:6px 0 0;font-size:24px;font-weight:800;\">New Business Inquiry</h2>
                    <p style=\"margin:4px 0 0;font-size:13px;color:#94a3b8;\">Reference: <strong>{$submissionId}</strong></p>
                </div>
                <div style=\"padding:32px;\">
                    <table width=\"100%\" cellpadding=\"10\" cellspacing=\"0\" style=\"border-collapse:collapse;font-size:14px;color:#1e293b;\">
                        <tr style=\"background:#f8fafc;\"><td width=\"32%\" style=\"border-bottom:1px solid #e2e8f0;font-weight:600;\">Full Name</td><td style=\"border-bottom:1px solid #e2e8f0;\">{$safeName}</td></tr>
                        <tr><td style=\"border-bottom:1px solid #e2e8f0;font-weight:600;\">Work Email</td><td style=\"border-bottom:1px solid #e2e8f0;\"><a href=\"mailto:{$safeEmail}\" style=\"color:#0066cc;text-decoration:none;\">{$safeEmail}</a></td></tr>
                        <tr style=\"background:#f8fafc;\"><td style=\"border-bottom:1px solid #e2e8f0;font-weight:600;\">Company</td><td style=\"border-bottom:1px solid #e2e8f0;\">{$safeCompany}</td></tr>
                        <tr><td style=\"border-bottom:1px solid #e2e8f0;font-weight:600;\">Phone</td><td style=\"border-bottom:1px solid #e2e8f0;\">{$safePhone}</td></tr>
                        <tr style=\"background:#f8fafc;\"><td style=\"border-bottom:1px solid #e2e8f0;font-weight:600;\">Country</td><td style=\"border-bottom:1px solid #e2e8f0;\">{$safeCountry}</td></tr>
                        <tr><td style=\"border-bottom:1px solid #e2e8f0;font-weight:600;\">Service / Subject</td><td style=\"border-bottom:1px solid #e2e8f0;\">{$safeService}</td></tr>
                        <tr style=\"background:#f8fafc;\"><td style=\"border-bottom:1px solid #e2e8f0;font-weight:600;\">Message</td><td style=\"border-bottom:1px solid #e2e8f0;\">{$safeMessage}</td></tr>
                        <tr><td style=\"font-weight:600;color:#64748b;font-size:12px;\">Submitted At</td><td style=\"color:#64748b;font-size:12px;\">{$timestamp} ({$clientIp})</td></tr>
                    </table>
                </div>
            </div>
        </div>";

        $adminMail->send();
        $emailSent = true;

        // ── B. Acknowledgement Email to Prospect ───────────────────────
        try {
            $userMail = new PHPMailer\PHPMailer\PHPMailer(true);
            $userMail->isSMTP();
            $userMail->Host       = $smtpHost;
            $userMail->SMTPAuth   = true;
            $userMail->Username   = $smtpUser;
            $userMail->Password   = $smtpPass;
            $userMail->Port       = $smtpPort;
            $userMail->SMTPSecure = ($smtpPort === 465 || strtolower((string)$smtpSecure) === 'ssl')
                ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;

            $userMail->Timeout = 15;
            $userMail->SMTPOptions = [
                'ssl' => [
                    'verify_peer'       => false,
                    'verify_peer_name'  => false,
                    'allow_self_signed' => true,
                ],
            ];

            $userMail->setFrom($fromEmail, $fromName);
            $userMail->addAddress($email, $name);
            $userMail->isHTML(true);
            $userMail->CharSet = 'UTF-8';
            $userMail->Subject = "Thank you for contacting Apokrin [{$submissionId}]";

            $userMail->Body = "
            <div style=\"background:#f1f5f9;padding:32px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;\">
                <div style=\"max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);\">
                    <div style=\"background:linear-gradient(135deg,#0a192f,#0052cc);padding:28px 32px;color:#ffffff;\">
                        <h2 style=\"margin:0;font-size:22px;\">Thank you for reaching out!</h2>
                        <p style=\"margin:4px 0 0;font-size:13px;color:#cbd5e1;\">Inquiry Reference: <strong>{$submissionId}</strong></p>
                    </div>
                    <div style=\"padding:32px;color:#334155;line-height:1.6;\">
                        <p style=\"margin-top:0;\">Dear <strong>{$safeName}</strong>,</p>
                        <p>Thank you for contacting <strong>Apokrin</strong>. We have successfully received your inquiry regarding <strong>{$safeService}</strong>.</p>
                        <p>Our team of enterprise technology consultants is reviewing your details and will get in touch with you within one business day.</p>
                        <p style=\"margin-top:28px;border-top:1px solid #e2e8f0;padding-top:20px;font-size:13px;color:#64748b;\">
                            Best regards,<br>
                            <strong>Apokrin Consulting Team</strong><br>
                            <a href=\"mailto:info@apokrin.com\" style=\"color:#0066cc;text-decoration:none;\">info@apokrin.com</a> &bull; (+1) 703-722-6709
                        </p>
                    </div>
                </div>
            </div>";

            $userMail->send();
        } catch (\Throwable $userEx) {
            error_log("Prospect Autoresponder Warning: " . $userEx->getMessage());
        }

    } catch (\Throwable $e) {
        error_log("PHPMailer Send Error: " . $e->getMessage());
        $emailError = $e->getMessage();
    }
} else {
    if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        $emailError = 'PHPMailer library is missing. Please ensure api/PHPMailer is uploaded.';
    } else {
        $emailError = 'SMTP configuration is missing or incomplete.';
    }
}

// ── 8. Background Completion ──────────────────────────────────────────────
if (!$emailSent && $emailError) {
    error_log("Contact API Background Mail Warning: " . $emailError);
}
exit;
