# Toastid Tech, LLC — Website

Static marketing site for Toastid Tech, LLC. Vanilla HTML/CSS/JS with no build step, designed for GitHub Pages and the `toastidtech.com` custom domain.

## Site structure

- `index.html` — Home
- `products.html` — Products & Services
- `resources.html` — Resources & Blog / SEO content hub
- `about.html` — About Us
- `contact.html` — Contact Us
- `disclaimer.html` — Cope legal disclaimer
- `scribe-vs-tango-vs-power-automate.html` — Automation comparison article
- `manifest.json` — Site PWA manifest
- `sw.js` — Service worker
- `robots.txt` — Crawler directives
- `sitemap.xml` — Search-engine sitemap
- `seo/` — SEO metadata, keyword strategy, and audit documentation
- `assets/styles.css` — Shared site styling
- `assets/site.js` — Shared interactivity, accessibility, SEO metadata/schema, and service-worker registration
- `assets/logos/` — Active product, brand, icon, and team imagery

## Current products

- Cope
- BiteFact
- 28-Day Walking Tai Chi
- Micro Habits
- CanvasFlow
- SOPilot
- Pulse Matrix

## SEO and accessibility

The site includes page-specific metadata, canonical URLs, Open Graph/Twitter metadata, Schema.org structured data, sitemap/robots configuration, accessible focus states, skip navigation, reduced-motion support, semantic ARIA enhancements, form autocomplete hints, and descriptive image alt text.

See `seo/audit-2026-09-05.md` for the latest source-level audit and remaining recommendations.

## Deployment

The repository contains a `CNAME` for `toastidtech.com` and is GitHub Pages-ready. If production content appears older than the `main` branch, check the active hosting/deployment connection and any CDN or service-worker cache before making further site edits.

## Development notes

- No build system or package manager is required.
- Keep shared changes in `assets/styles.css` or `assets/site.js` whenever practical so all pages benefit from the fix.
- Do not reintroduce retired PlateIQ assets or placeholder/generated image files.
- Product links should point to their actual live destinations when available.
