# PLAN.md — CHAT.ZYEKH.COM SEO & GROWTH ENGINE (PHASE 1 STANDARDIZATION)

## Objective
Standardize and implement Technical SEO Baseline, W3C XML Sitemap, Robots crawler directives, comprehensive Schema.org JSON-LD structured data (`WebApplication`, `SoftwareApplication`, `FAQPage`), and high-resolution Open Graph metadata for `chat.zyekh.com` to achieve instant search engine discoverability, Lighthouse 100/100 SEO score, and seamless Google Search Console indexing.

---

## Execution Chunks (Phase 1)

### Chunk 1: W3C Standard XML Sitemap & Robots Directives
- **Target Files**: `sitemap.xml`, `robots.txt` (Root directory)
- **Implementation Steps**:
  1. Create `sitemap.xml` with standard XML schema (`http://www.sitemaps.org/schemas/sitemap/0.9`):
     - Entry for `https://chat.zyekh.com/` (`changefreq: daily`, `priority: 1.0`).
     - Last modification timestamp matching current release.
  2. Create `robots.txt` with permissive crawler policies:
     - `User-agent: *`
     - `Allow: /`
     - `Sitemap: https://chat.zyekh.com/sitemap.xml`
- **DoD**: `curl -Is http://localhost:3005/sitemap.xml` and `curl -Is http://localhost:3005/robots.txt` return HTTP 200 with valid XML/text headers.

### Chunk 2: Comprehensive Schema.org JSON-LD & Social Open Graph Expansion
- **Target Files**: `index.html`, `404.html` (lines ~20-55)
- **Implementation Steps**:
  1. Expand JSON-LD structured data graph in `<head>`:
     - `@type: WebApplication` & `@type: SoftwareApplication` with `applicationCategory: ProductivityApplication`, `operatingSystem: All`, `browserRequirements: Requires HTML5/ES6 support`, `offers: { @type: Offer, price: 0, priceCurrency: USD }`.
     - `@type: FAQPage` structured data covering 4 key search queries:
       • "Apa itu Zyekh AI Companion?"
       • "Apakah obrolan di chat.zyekh.com aman dan privat?"
       • "Model AI apa saja yang didukung?"
       • "Bagaimana cara mengganti foto profil dan prompt khusus?"
     - `@type: Person` author metadata linked to `https://zyekh.com/about/`.
  2. Enhance Open Graph (`og:*`) & Twitter Card (`twitter:*`):
     - `og:site_name`, `og:locale: id_ID`, `og:image: https://chat.zyekh.com/assets/icons/apple-icon-180x180.png`.
     - Clear keyword tags targeting: "AI Companion, Private AI Chat, Multi-Model AI Gateway, Claude Sonnet, Gemini Flash, Developer Brainstorming".
- **DoD**: JSON-LD passes Google Rich Results Validator syntax checks with 0 errors.

### Chunk 3: Web App Manifest & Metadata SEO Polish
- **Target Files**: `manifest.json`, `index.html`, `404.html`
- **Implementation Steps**:
  1. Verify `manifest.json` parameters:
     - `name`: "Zyekh AI Companion"
     - `short_name`: "Zyekh Chat"
     - `categories`: `["productivity", "utilities", "developer tools"]`
     - `start_url`: "/"
     - `display`: "standalone"
     - `background_color`: "#09090b"
     - `theme_color`: "#09090b"
  2. Ensure apple touch icon and favicon tags are properly linked with exact MIME types.
- **DoD**: Lighthouse PWA/SEO audit returns 100/100.

### Chunk 4: Canonical Integrity & GSC Readiness
- **Target Files**: `index.html`, `404.html`
- **Implementation Steps**:
  1. Enforce canonical tag `<link rel="canonical" href="https://chat.zyekh.com/" />`.
  2. Add meta placeholder tag for Google Search Console domain verification:
     `<meta name="google-site-verification" content="..." />` (or DNS-based ready).
- **DoD**: Canonical URLs match root domain 100%.

### Chunk 5: Empirical Verification, Cache Busting & Obsidian Checkpoint
- **Target Files**: `index.html`, `404.html`, `server.js`, `sitemap.xml`, `robots.txt`
- **Implementation Steps**:
  1. Synchronize `404.html` with `index.html`.
  2. Bump cache bust query string to `?v=20260821_v360`.
  3. Run `python3 check_emojis.py` (0 emojis).
  4. Run `node -c server.js` and `node -c assets/js/app.js`.
  5. Verify HTTP responses on `http://localhost:3005`.
  6. Commit changes locally.
  7. Update Obsidian RAG `STATE.md`, `INDEX.md`, and `DECISIONS.md`.
- **DoD**: 0 linter errors, 0 emoji violations, local server healthy, all SEO files served cleanly.
