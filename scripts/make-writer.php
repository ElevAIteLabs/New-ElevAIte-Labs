<?php
/**
 * Prints the SQL to add a writer account.
 *
 *   php scripts/make-writer.php priya
 *
 * Lives in scripts/ rather than api/ on purpose: build-deploy.mjs copies
 * api/ to the server, and a web-reachable script that mints admin accounts
 * is not something to leave lying in the document root. It also only prints
 * SQL - it never touches the database, so there is nothing to undo if you
 * run it by mistake.
 *
 * The password is generated here rather than chosen, because the accounts
 * this creates can publish to a public website and "Welcome123" is what
 * gets chosen otherwise. Hand it over, and have them change it.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit();
}

$username = trim($argv[1] ?? '');
if ($username === '' || !preg_match('/^[a-z0-9._-]{3,50}$/i', $username)) {
    fwrite(STDERR, "Usage: php scripts/make-writer.php <username>\n");
    fwrite(STDERR, "Letters, digits, dot, underscore or hyphen; 3-50 characters.\n");
    exit(1);
}

// 18 bytes of randomness, base64 without the awkward characters.
$password = substr(strtr(base64_encode(random_bytes(18)), '+/=', 'xyz'), 0, 20);
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "\nRun this on the database:\n\n";
echo "  INSERT INTO admins (username, password, role)\n";
echo "  VALUES ('" . $username . "', '" . $hash . "', 'writer');\n\n";
echo "Give them these credentials, once, over something other than email:\n\n";
echo "  username: $username\n";
echo "  password: $password\n\n";
echo "A writer account can create and publish blog posts. It cannot reach\n";
echo "enquiries, services, case studies, products or contact settings.\n\n";
