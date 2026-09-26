<?php
/**
 * Lists the models the configured OpenAI key can actually reach.
 *
 *   php scripts/list-openai-models.php
 *
 * Published pricing tables disagree with each other and go stale within
 * weeks, and an account's access depends on its tier - so the model for
 * Arkin gets chosen from what this prints, not from a blog post.
 *
 * Lives in scripts/ rather than api/ because build-deploy.mjs copies api/
 * to the server and this reads a billing credential. It prints model names
 * only; the key is never echoed, logged, or sent anywhere but OpenAI.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit();
}

$configPath = __DIR__ . '/../api/config.php';
if (!is_readable($configPath)) {
    fwrite(STDERR, "No api/config.php. Copy api/config.example.php to api/config.php first.\n");
    exit(1);
}

$config = require $configPath;
$key = $config['chat']['api_key'] ?? '';

if (trim($key) === '') {
    fwrite(STDERR, "config.php has no chat.api_key set.\n");
    fwrite(STDERR, "Add it under 'chat' => ['api_key' => '...'] - never in .env as VITE_*.\n");
    exit(1);
}

$ch = curl_init('https://api.openai.com/v1/models');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . trim($key)],
    CURLOPT_TIMEOUT => 30,
]);
$body = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($body === false) {
    fwrite(STDERR, "Request failed: $err\n");
    exit(1);
}

if ($status !== 200) {
    // Deliberately does not print the response body verbatim - an auth error
    // can echo back part of the credential.
    fwrite(STDERR, "OpenAI returned HTTP $status.\n");
    fwrite(STDERR, $status === 401
        ? "The key was rejected. Check it is current and has not been revoked.\n"
        : "Check the account's status at platform.openai.com.\n");
    exit(1);
}

$data = json_decode($body, true)['data'] ?? [];
if (!$data) {
    fwrite(STDERR, "No models returned.\n");
    exit(1);
}

$names = array_column($data, 'id');
sort($names);

// Chat-capable families, so the list is not drowned by embeddings, audio,
// image and moderation models.
$chat = array_values(array_filter($names, fn($n) => preg_match('/^(gpt|o[0-9]|chatgpt)/i', $n)
    && !preg_match('/(embed|audio|tts|whisper|image|realtime|transcribe|moderation|search|dall)/i', $n)));

echo "\nChat-capable models this key can reach (" . count($chat) . " of " . count($names) . " total):\n\n";
foreach ($chat as $n) {
    echo "  $n\n";
}
echo "\nPick one for 'model' in api/config.php -> chat.\n";
echo "Cheaper, smaller models are fine for FAQ answering; Arkin also has to\n";
echo "decide when NOT to answer and when to capture a lead, which is judgement.\n\n";
