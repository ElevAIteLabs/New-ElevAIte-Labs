# ElevAIte Labs Website

The live site at [elevaitelabs.in](https://elevaitelabs.in) — a React 19 + Vite 8 single-page
app with a small PHP + MySQL API, hosted on Hostinger shared hosting.

> **Branches:** `master` is the site. The `main` branch holds the original
> hand-written static HTML version that was replaced in May 2026 and is kept
> only for history — do not build from it.

## Layout

```
src/            React app (pages, components, hooks)
public/         Copied verbatim into the site root at build time
                (pictures/, favicon.png, logo.jpg, .htaccess SPA rewrite)
api/            PHP API deployed to public_html/api/
scripts/        Build + deploy tooling
db.json         Fixture data for local development (json-server)
```

## Local development

```bash
cp .env.example .env
cp api/config.example.php api/config.php   # only needed to run the real API
npm install
npm run dev
```

`npm run dev` starts Vite plus a `json-server` on port 5000. In dev the pages read
from `db.json` rather than PHP, so you do not need MySQL running. The admin login
accepts `admin` / `admin123` in dev only — that fallback is compiled out of
production builds.

## Configuration

Two files hold environment-specific values and **neither is committed**:

| File | Purpose |
| --- | --- |
| `.env` | `VITE_API_URL` — base URL of the PHP API, baked into the bundle at build time |
| `api/config.php` | DB credentials, allowed CORS origins, debug flag |

Copy the matching `.example` file and fill it in. If `.env` is missing the build
would otherwise produce requests to `undefined/login.php`, so `npm run build:deploy`
fails fast instead.

## Deploying

```bash
npm run build:deploy
```

This builds the site and assembles `deploy/`, which mirrors exactly what belongs in
`public_html/`. Upload its **contents** to `public_html/` on Hostinger.

`api/config.php` is included in the payload, so the credentials travel with the
upload without ever entering git.

## API

Base path `/api`. Reads are public; every write requires an admin session cookie
issued by `login.php`.

| Endpoint | Methods | Auth |
| --- | --- | --- |
| `products.php`, `services.php`, `work.php`, `learn.php`, `testimonials.php` | GET | public |
| the same, plus `contact.php` | POST / PUT / PATCH / DELETE | **admin** |
| `upload.php` | POST | **admin** |
| `login.php` | POST | public |
| `logout.php` | POST | public |
| `session.php` | GET | public (reports whether you are signed in) |

Notes:

- Sessions are server-side PHP sessions on an `HttpOnly` cookie. The admin UI asks
  `session.php` whether it is signed in; it never trusts a `localStorage` flag for access.
- Write payloads are filtered against the real table columns, so unexpected JSON keys
  can never reach the SQL statement.
- `upload.php` verifies the decoded image, rejects SVG (script-carrying), caps uploads
  at 5 MB, and rebuilds the filename to prevent path traversal or overwrites.
