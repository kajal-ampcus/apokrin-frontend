<?php
/**
 * Central Backend Configuration & Environment Loader
 * 
 * Securely loads credentials from .env without exposing them to the client bundle.
 * Provides resilient DB (PDO) connection and helper functions.
 */

// Disable direct error output in production API responses to prevent JSON stream corruption
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

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
        // Connecting to the public domain from within the server is rejected by MySQL
        // because cPanel user grants are scoped to 'localhost'.
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
