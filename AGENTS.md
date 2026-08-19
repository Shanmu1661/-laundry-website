# AGENTS.md

## What this is

Pure static HTML/CSS/JS marketing site (LaundryPro). No package.json, no build step, no backend, no tests/lint. Verify changes by opening files in a browser or serving the repo root statically (e.g. `python -m http.server`).

Deployed on GitHub Pages from the repo **root** on `main` (remote `Shanmu1661/-laundry-website`). Keep pages at root; do not move them into subfolders.

## Key files

- `assets/js/main.js` — shared behavior, loaded by all 32 pages. Owns: theme toggle (`localStorage.laundryProTheme`, `.dark` class on `<body>`), RTL toggle (`localStorage.laundryProDirection`; swaps the Bootstrap CDN link `bootstrap.min.css` ↔ `bootstrap.rtl.min.css` and sets `dir` on `<html>`), converting the nav "Home" link (`a.nav-link[href="index.html"]`) into a Home/Home-2 dropdown (CSS-only `show` class — no Bootstrap JS required), active-nav highlighting by current filename, footer copyright injection, `.needs-validation` forms (footer forms redirect to `contact-confirmation.html`), `[data-counter]` counters, `[data-filter]` service filtering, and `#customerLogin`/`#customerRegister`/`handleSocialAuth` mock auth.
- `assets/css/style.css` — all site styles. `:root` brand tokens on line 2 (`--brand:#176bdf`, `--ink`, `--soft`, `--line`, ...). Dark mode is scoped `body.dark { ... }`; RTL support uses logical properties — keep additions bidi-safe.
- `documentation/README.md` — brief customization notes.

## Gotchas

- `assets/js/navbar-login.js` and `assets/css/navbar-login.css` are **orphaned** (no HTML references them). Do not wire them up — `navbar-login.js` references images that don't exist (`assets/images/work-1.svg`, etc.).
- main.js has **dead code** for selectors no page uses anymore: `.nav-booking` (relocates the theme button / auto-injects a missing `[data-direction]` button) and `.nav-user-menu` (removal). Every page now authors the theme/direction buttons directly in navbar markup — keep that pattern.
- `Laundry project/` nested empty directories are untracked leftovers from a removed nested repo — ignore.
- Bootstrap (CSS + bundle JS), Font Awesome, Google Fonts load from CDN; site breaks offline unless vendored into `assets/vendors/`.
- Bootstrap bundle JS is loaded on 10 pages (index, home-2, blog, pricing, faq, the five `category-*`); AOS additionally only on index, blog, pricing. Everything else loads only main.js. main.js guards optional plugins via `window.AOS`/`GLightbox`/`Swiper`, so partial includes work — keep that pattern (Swiper/GLightbox aren't loaded by any page yet). `contact.html` uses `data-aos` attributes but loads no AOS — those attributes are inert there.
- Auth is a client-side mock: `main.js` stores `laundryProCustomerName` in localStorage; `handleSocialAuth` only alerts and redirects to index.html.
- Adding a page: copy an existing page's `<head>` (the Bootstrap CSS link must match the `bootstrap(.rtl)?.min.css` pattern — all pages use `bootstrap@5.3.3/dist/css/bootstrap.min.css` — or the RTL swap won't find it) and navbar markup, and include `assets/js/main.js` at the end of `<body>`. Navbar behaviors need `data-menu-toggle`/`data-menu`/`data-theme`/`data-direction` attributes; `maintenance.html` is the minimal reference (no nav links, no login buttons). The only pages without a navbar are `404.html` and `contact-confirmation.html`. Don't add a second static "Home 2" nav link — main.js turns the Home link into the dropdown.
- Some pages are hand-minified single-line markup (maintenance.html, terms.html, services.html, cookie-policy.html, privacy-policy.html, forgot-password.html) — preserve the compact format when editing.
