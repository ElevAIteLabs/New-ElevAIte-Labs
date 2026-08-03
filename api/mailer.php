<?php
/**
 * Outgoing mail for contact form notifications.
 *
 * Uses PHPMailer over authenticated SMTP rather than mail(), so messages are
 * sent through a real authenticated account and are far less likely to be
 * treated as spam. Credentials live in config.php, which is gitignored and
 * excluded from deploys - nothing here ends up in the public JS bundle,
 * which was the problem with sending from the browser via EmailJS.
 */

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

/** Header values must never contain newlines, or they can inject headers. */
function mail_safe($value) {
    return trim(preg_replace('/[\r\n]+/', ' ', (string) $value));
}

/**
 * @return array{ok: bool, error: ?string}
 */
function send_lead_mail(array $lead) {
    $config = ELEVAITE_CONFIG;
    $smtp = $config['smtp'] ?? [];

    if (empty($smtp['enabled'])) {
        return ['ok' => false, 'error' => 'SMTP is not enabled in config.php'];
    }

    $name = mail_safe($lead['name']);
    $email = mail_safe($lead['email']);

    // Reject anything that is not a valid address before it reaches a header.
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['ok' => false, 'error' => 'Invalid submitter email'];
    }

    $rows = [
        'Name'    => $lead['name'],
        'Email'   => $lead['email'],
        'Phone'   => $lead['phone'] ?: 'Not provided',
        'Company' => $lead['company'] ?: 'Not provided',
        'Role'    => $lead['role'],
        'Service' => $lead['service'],
        'Budget'  => $lead['budget'] ?: 'Not specified',
    ];

    $tableRows = '';
    $plainRows = '';
    foreach ($rows as $label => $value) {
        $tableRows .= '<tr>'
            . '<td style="padding:6px 14px 6px 0;color:#64748b;white-space:nowrap;">' . htmlspecialchars($label) . '</td>'
            . '<td style="padding:6px 0;color:#0f172a;"><strong>' . htmlspecialchars((string) $value) . '</strong></td>'
            . '</tr>';
        // Plain-text clients would otherwise get the table cells run together.
        $plainRows .= str_pad($label . ':', 10) . $value . "\n";
    }

    $messageHtml = nl2br(htmlspecialchars((string) $lead['message']));
    $messagePlain = (string) $lead['message'];

    $teamBody = "<div style=\"font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;\">"
        . "<h2 style=\"margin:0 0 4px;font-size:20px;\">New enquiry from the website</h2>"
        . "<p style=\"margin:0 0 20px;color:#64748b;font-size:14px;\">Lead #{$lead['id']}</p>"
        . "<table style=\"border-collapse:collapse;font-size:15px;\">{$tableRows}</table>"
        . "<h3 style=\"margin:24px 0 6px;font-size:15px;color:#64748b;font-weight:600;\">Project</h3>"
        . "<div style=\"padding:14px 16px;background:#f8fafc;border-radius:10px;border-left:3px solid #1e88e5;\">{$messageHtml}</div>"
        . "</div>";

    // The confirmation repeats every field too, so the sender has a complete
    // record of what they submitted rather than just their own message.
    $clientBody = "<div style=\"font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.65;color:#0f172a;\">"
        . "<p>Hi " . htmlspecialchars($name) . ",</p>"
        . "<p>Thanks for getting in touch with ElevAIte Labs. We have your enquiry and one of us will reply within one business day.</p>"
        . "<p>If your project is in scope we will send a 30-minute call invite. If it is not, we will tell you who would be a better fit.</p>"
        . "<h3 style=\"margin:26px 0 8px;font-size:15px;color:#64748b;font-weight:600;\">What you sent</h3>"
        . "<table style=\"border-collapse:collapse;font-size:15px;\">{$tableRows}</table>"
        . "<h3 style=\"margin:22px 0 6px;font-size:15px;color:#64748b;font-weight:600;\">Your message</h3>"
        . "<div style=\"padding:14px 16px;background:#f8fafc;border-radius:10px;border-left:3px solid #1e88e5;\">{$messageHtml}</div>"
        . "<p style=\"margin-top:24px;\">- The ElevAIte Labs team<br>"
        . "<span style=\"color:#64748b;font-size:14px;\">HITEC City, Hyderabad</span></p>"
        . "</div>";

    $errors = [];

    // Two separate messages, so a failure to reach the submitter still gets
    // the lead in front of the team.
    foreach ([
        ['to' => $smtp['notify'], 'toName' => 'ElevAIte Labs',
         'subject' => "New enquiry: {$name}" . ($lead['company'] ? " ({$lead['company']})" : ''),
         'body' => $teamBody,
         'text' => "New enquiry from the website (lead #{$lead['id']})\n\n{$plainRows}\nProject:\n{$messagePlain}\n",
         'replyTo' => $email, 'replyToName' => $name],

        ['to' => $email, 'toName' => $name,
         'subject' => 'We received your enquiry - ElevAIte Labs',
         'body' => $clientBody,
         'text' => "Hi {$name},\n\nThanks for getting in touch with ElevAIte Labs. We have your enquiry and one of us will reply within one business day.\n\nWhat you sent\n{$plainRows}\nYour message:\n{$messagePlain}\n\n- The ElevAIte Labs team\nHITEC City, Hyderabad\n",
         'replyTo' => $smtp['reply_to'], 'replyToName' => 'ElevAIte Labs'],
    ] as $msg) {
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->Port = (int) $smtp['port'];
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['username'];
            $mail->Password = $smtp['password'];
            $mail->SMTPSecure = $smtp['encryption'] === 'ssl'
                ? PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Timeout = 15;
            $mail->CharSet = 'UTF-8';

            $mail->setFrom($smtp['from_email'], mail_safe($smtp['from_name']));
            $mail->addAddress($msg['to'], mail_safe($msg['toName']));
            if (!empty($msg['replyTo'])) {
                $mail->addReplyTo($msg['replyTo'], mail_safe($msg['replyToName']));
            }

            $mail->isHTML(true);
            $mail->Subject = mail_safe($msg['subject']);
            $mail->Body = $msg['body'];
            $mail->AltBody = $msg['text'];

            $mail->send();
        } catch (MailException $e) {
            $errors[] = $msg['to'] . ': ' . $e->getMessage();
        } catch (Throwable $e) {
            $errors[] = $msg['to'] . ': ' . $e->getMessage();
        }
    }

    return $errors
        ? ['ok' => false, 'error' => implode(' | ', $errors)]
        : ['ok' => true, 'error' => null];
}
