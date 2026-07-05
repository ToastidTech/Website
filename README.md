# Toastid Tech, LLC — Website

Static site, GitHub Pages-ready. Same stack as your PWAs: vanilla HTML/CSS/JS, no build step.

## What's in here

```
index.html          Home
products.html        Products & Services (6 apps + 2 consulting services)
about.html            About Us (4 team members)
contact.html          Contact Us (Formspree form)
disclaimer.html       Cope legal disclaimer
manifest.json         PWA manifest
sw.js                 Service worker (cache-first, offline fallback to Home)
assets/
  styles.css          Shared site styles (dark navy/black + electric blue theme)
  site.js             Shared interactivity: particle background, 3D tilt cards,
                       scroll reveals, count-up stats, service worker registration
  logos/               All logos, app icons, team photos
```

## Deploy to GitHub Pages (toastidtech.github.io)

1. In your `toastidtech.github.io` repo, copy every file/folder from this package into the repo root (or into a subfolder if this should live at a path instead of the root — adjust `start_url` and `scope` in `manifest.json` and the `PRECACHE_URLS` paths in `sw.js` to match).
2. Commit and push.
3. GitHub Pages will serve it automatically at `https://toastidtech.github.io/` (or your configured path) within a minute or two.
4. Hard-refresh (or clear site data) the first time you visit, since the service worker aggressively caches.

## Still needs your input before this is fully live-ready

- **Micro Tasks logo** — currently a placeholder icon on the Products page. Swap in `assets/logos/microtasks-logo.png` (or whatever you name it) once it's ready, and update the `<img>` reference in `products.html`.
- **App links** — `28-Day Walking Tai Chi` and `CanvasFlow` product cards link to `#` placeholders. Update with the real live URLs (SOPilot's link is already wired to `toastidtech.github.io/sopilot/`).
- **Service booking links** — Personal Consultation and Business Audit buttons currently route to the Contact page. If you set up Square checkout links for these, swap them in directly in `products.html`.
- **Team photos** — Tiff, the Website Designer, and the Compliance Officer are currently placeholder initials (T / W / C) on the About page. Drop real headshots into `assets/logos/` and swap the `<div class="team-photo">` blocks for `<img>` tags like Sean's.
- **Cope pricing** — the Products page currently shows the $12.99/mo standalone price. If Cope's Hormozi-style repricing is final, update the price and feature list on that card.

## Notes

- No Cloudflare Worker is included — this site doesn't call the Anthropic API anywhere, so there's nothing for a worker to proxy. If you add an AI-powered feature to the site later (e.g. an on-site consulting-fit quiz), let me know and I'll wire one up using your existing `muddy-violet-2a0d` worker pattern.
- The particle background, 3D card tilt, and scroll animations all respect `prefers-reduced-motion` and degrade gracefully on mobile/touch.
- Every page shares the same `assets/styles.css` and `assets/site.js` — edit once, updates everywhere.
