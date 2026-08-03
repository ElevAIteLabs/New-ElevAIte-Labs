<?php
require_once __DIR__ . '/db.php';

/**
 * GET  - the public contact details shown on the site (handled by handleCrud)
 * PUT  - admin editing those details (handled by handleCrud)
 * POST - a contact form submission
 *
 * The submission is written to `leads` before anything else happens. Mail and
 * the Kredoo webhook run afterwards and record their own outcome, so a failure
 * in either never loses the enquiry. The browser previously called EmailJS and
 * the webhook directly, stored nothing, and reported success regardless.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    handleCrud($db, 'contact');
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request body']);
    exit();
}

// Bots fill in every field they find. Real users never see this one.
if (!empty($input['website'])) {
    echo json_encode(['status' => 'success', 'id' => null]);
    exit();
}

$clean = static function ($v, $max) {
    return mb_substr(trim((string) ($v ?? '')), 0, $max);
};

$lead = [
    'name'    => $clean($input['name'] ?? '', 191),
    'email'   => $clean($input['email'] ?? '', 191),
    'phone'   => $clean($input['phone'] ?? '', 64),
    'company' => $clean($input['company'] ?? '', 191),
    'role'    => $clean($input['role'] ?? '', 191),
    'service' => $clean($input['service'] ?? '', 191),
    'budget'  => $clean($input['budget'] ?? '', 64),
    'message' => $clean($input['message'] ?? '', 5000),
];

$missing = [];
foreach (['name', 'email', 'role', 'service', 'message'] as $field) {
    if ($lead[$field] === '') $missing[] = $field;
}
if (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
    $missing[] = 'a valid email';
}
if ($missing) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please provide: ' . implode(', ', array_unique($missing))]);
    exit();
}

$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';

// Light flood protection. Not a substitute for a captcha, but it stops a
// single source hammering the form and filling the table.
try {
    $recent = $db->prepare('SELECT COUNT(*) FROM leads WHERE ip = :ip AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $recent->execute(['ip' => $ip]);
    if ((int) $recent->fetchColumn() >= 8) {
        http_response_code(429);
        echo json_encode(['status' => 'error', 'message' => 'Too many submissions. Please email us directly.']);
        exit();
    }
} catch (Exception $e) {
    // Never block a genuine enquiry because the rate check itself failed.
}

/* 1. Persist first. If this fails the visitor is told, rather than being
      shown a success screen for an enquiry nobody received. */
try {
    $stmt = $db->prepare(
        'INSERT INTO leads (name, email, phone, company, role, service, budget, message, ip, user_agent)
         VALUES (:name, :email, :phone, :company, :role, :service, :budget, :message, :ip, :ua)'
    );
    $stmt->execute($lead + [
        'ip' => $ip,
        'ua' => mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
    ]);
    $lead['id'] = (int) $db->lastInsertId();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'We could not record your enquiry. Please email contact@elevaitelabs.in directly.',
        'detail' => ELEVAITE_CONFIG['debug'] ? $e->getMessage() : null,
    ]);
    exit();
}

/* 2. Email the team, and confirm to the sender. */
require_once __DIR__ . '/mailer.php';
$mail = send_lead_mail($lead);

/* 3. Forward to the CRM. The URL lives in config so it is not exposed in the
      JS bundle, where anyone could read it and post junk leads. */
$webhookStatus = 'skipped';
$webhookError = null;
$webhookUrl = ELEVAITE_CONFIG['kredoo_webhook'] ?? '';

if ($webhookUrl !== '' && function_exists('curl_init')) {
    $ch = curl_init($webhookUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($lead + ['source' => 'Website Contact Form']),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError !== '' || $code < 200 || $code >= 300) {
        $webhookStatus = 'failed';
        $webhookError = $curlError !== '' ? $curlError : "HTTP $code: " . mb_substr((string) $body, 0, 300);
    } else {
        $webhookStatus = 'sent';
    }
}

/* 4. Record what happened, so failures are visible in the admin panel. */
try {
    $db->prepare(
        'UPDATE leads SET mail_status = :ms, mail_error = :me, webhook_status = :ws, webhook_error = :we WHERE id = :id'
    )->execute([
        'ms' => $mail['ok'] ? 'sent' : 'failed',
        'me' => $mail['error'],
        'ws' => $webhookStatus,
        'we' => $webhookError,
        'id' => $lead['id'],
    ]);
} catch (Exception $e) {
    // The lead is already saved; a bookkeeping failure must not fail the request.
}

// The enquiry is stored, so this is a success from the visitor's side even if
// a downstream service was unavailable.
echo json_encode([
    'status' => 'success',
    'id' => $lead['id'],
    'delivery' => ['mail' => $mail['ok'] ? 'sent' : 'failed', 'webhook' => $webhookStatus],
]);
