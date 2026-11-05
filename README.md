# AASHIK — Portfolio

Dark editorial portfolio for **Aashik Ahamed A** — full stack developer (React · Node · MongoDB · AI-assisted builds), based in Trichy, Tamil Nadu.

The site is a **hand-written static build**: one `index.html`, local fonts/images, zero frameworks, zero network dependencies at runtime. It works offline and can be deployed anywhere.

## Quick start

- **Double-click** `START-PORTFOLIO.bat` — detects Node (`serve.js`) or Python (`http.server`), serves the folder on `http://localhost:8347/` and opens your browser.
- Or run it manually: `node serve.js` · `python -m http.server 8347`
- Deploy: `npx vercel` (from this folder) or drag-and-drop onto Netlify / GitHub Pages.

## Highlights

- Hero with cutout portrait, oversized `PORTFOLIO` display type, lime `#c5ff0a` accent.
- **Lenis smooth scrolling** (local, 18 KB) with eased anchor navigation — disabled automatically for `prefers-reduced-motion`.
- Scroll-linked motion: hero parallax (wordmark drifts left, portrait lifts), project-image parallax, reveal-on-scroll for every section (fade + rise + de-blur), hero entrance choreography.
- Scroll-driven **Identify → Engineer → Ship** story strip with progress indicator and floating project previews.
- Six-area skills accordion (keyboard accessible, arrow-key navigation).
- Selected work: Tech Pixel A2H (live hero screenshot), AI e-commerce engine, real-time B2B workspace (clearly labelled illustrative UI + demo data).
- **INSIDE THE BUILD** — tabbed walkthrough of vector search, Redis cache-aside, JWT + RBAC and the CI/CD pipeline, with illustrative telemetry.
- **NOVA** — fully local portfolio concierge (no API keys, no tracking).
- Contact form → `mailto:` (no server required).
- Resume at `assets/Aashik-Resume.pdf`.

## Structure

```
index.html            # all markup
css/reference/        # localised copy of the reference design system (fonts rewired to /assets/fonts)
css/lenis.css         # minimal Lenis styles
css/motion.css        # reveal-on-scroll + hero entrance animations (reduced-motion safe)
css/nova.css          # NOVA concierge, drawer links, floating trigger
js/lenis.min.js       # Lenis smooth scroll (local copy)
js/clone.js           # Lenis init, header state, drawer, parallax, story chapters, accordion, tabs, NOVA, mailto
assets/               # portrait (bg removed), project previews, PDF résumé, og cover
assets/fonts/         # Inter + JetBrains Mono variable fonts (OFL, .woff2)
favicon.svg
serve.js              # zero-dependency static server (port 8347)
START-PORTFOLIO.bat   # double-click launcher (Node or Python fallback)
```

## Editing

- Resume/content: edit `index.html` — anchor IDs: `#about`, `#skills`, `#projects`, `#experience`, `#contact`.
- Skills content: six `EditorialSections-module__YfyJba__serviceItem` blocks in `index.html` (open state lives on `data-open`).
- Project cards: `.WorkSections-module__...projectRow` blocks in `index.html`.
- INSIDE THE BUILD tabs: `.WorkSections-module__...coreTab` buttons and `#core-panel-*` panels in `index.html`.
- Replace `assets/Aashik-Resume.pdf` with an updated résumé.

## Honesty / licensing

Portrait is Aashik's own photo (`D:\cv`). Project UIs for the two internship apps are **illustrative previews with demo data**, labelled as such; the Tech Pixel hero is a real screenshot of the live build. Fonts are SIL Open Font License. No analytics or tracking.
