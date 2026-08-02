/**
 * Builds the site and assembles everything that belongs in Hostinger's
 * public_html into a single ./deploy folder.
 *
 *   npm run build:deploy   ->   upload the contents of ./deploy to public_html/
 *
 * Vite already copies public/* (pictures, favicon, .htaccess) into dist/,
 * so the only extra step is dropping the PHP API alongside it.
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const deploy = path.join(root, 'deploy');

if (!existsSync(path.join(root, '.env'))) {
  console.error('\n  Missing .env - copy .env.example to .env first.');
  console.error('  Without VITE_API_URL the build calls "undefined/login.php".\n');
  process.exit(1);
}

console.log('> vite build');
execSync('npx vite build', { cwd: root, stdio: 'inherit' });

// Crawlers must receive populated HTML, not the empty SPA shell.
console.log('\n> prerender routes');
execSync('node scripts/prerender.mjs', { cwd: root, stdio: 'inherit' });

console.log('\n> robots.txt + sitemap.xml');
execSync('node scripts/gen-seo-files.mjs', { cwd: root, stdio: 'inherit' });

rmSync(deploy, { recursive: true, force: true });
mkdirSync(deploy, { recursive: true });

cpSync(dist, deploy, { recursive: true });
cpSync(path.join(root, 'api'), path.join(deploy, 'api'), { recursive: true });

if (!existsSync(path.join(root, 'api', 'config.php'))) {
  console.warn('\n  api/config.php not found - the API will return 500 until it exists on the server.');
  console.warn('  Copy api/config.example.php to api/config.php and fill in the DB credentials.\n');
}

console.log(`\nReady: ${path.relative(root, deploy)}/`);
console.log(readdirSync(deploy).sort().map((f) => `  ${f}`).join('\n'));
console.log('\nUpload the CONTENTS of deploy/ into public_html/ on Hostinger.');
