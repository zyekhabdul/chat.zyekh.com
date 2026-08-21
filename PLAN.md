# PLAN.md — REDESIGN CHAT.ZYEKH.COM TO ZYEKH.COM DESIGN SYSTEM

## Objective
Overhaul the visual design, token architecture, typography, and UX patterns of `chat.zyekh.com` to achieve 100% design parity with `zyekh.com`.

---

## Execution Chunks

### Chunk 1: Self-Hosted Font Assets & Font Declarations
- **Scope**: `assets/fonts/` (copy from `/home/fuckadmin/Projects/zyekh.com/assets/fonts/`), create `assets/fonts/fonts.css` and `assets/fonts/fonts.min.css`.
- **Details**:
  - `outfit-600-normal.woff2`, `outfit-700-normal.woff2`, `outfit-800-normal.woff2`
  - `inter-variable-latin.woff2`
  - `fira-code-400-normal.woff2`, `fira-code-600-normal.woff2`
- **DoD**: Files exist in `assets/fonts/`, `@font-face` correctly maps font families `'Outfit'`, `'Inter'`, and `'Fira Code'`.

### Chunk 2: Pure Monochrome Zinc CSS Architecture
- **Scope**: `assets/css/app.css`
- **Details**:
  - CSS Cascade Layers: `@layer reset, base, components, utilities;`
  - Tokens for `:root` (Dark) and `[data-theme="light"]`:
    - Dark: `--bg-dark: #09090b; --bg-main: #09090b; --bg-card: #141417; --bg-secondary: #18181b; --border-color: #27272a; --border-hover: #52525b; --text-main: #fafafa; --text-muted: #a1a1aa; --text-faint: #71717a; --accent: #ffffff; --accent-glow: rgba(255, 255, 255, 0.08); --code-bg: #000000;`
    - Light: `--bg-dark: #f0f0f3; --bg-main: #ffffff; --bg-card: #ffffff; --bg-secondary: #f4f4f5; --border-color: #d4d4d8; --border-hover: #71717a; --text-main: #09090b; --text-muted: #27272a; --text-faint: #71717a; --accent: #09090b; --accent-glow: rgba(0, 0, 0, 0.05); --code-bg: #e4e4e7;`
    - Radius: `--radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px;`
    - Transitions: `--transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);`
  - Styling for Sidebar, Top Navbar, Theme Toggle, Brand Badge, History Items, Welcome Screen, Suggestion Cards, Chat Feed, Message Bubbles, Code Blocks, Sibling Copy Button, Input Wrapper, and Typing Dots.
- **DoD**: CSS valid, all cyan/blue hardcoded colors replaced with pure monochrome zinc tokens.

### Chunk 3: HTML Structure & Anti-FOUC Synchronization
- **Scope**: `index.html` and `404.html`
- **Details**:
  - Inject blocking Anti-FOUC theme initializer in `<head>`:
    `<script>var s=localStorage.getItem('theme');if(s)document.documentElement.setAttribute('data-theme',s);else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)document.documentElement.setAttribute('data-theme','light');</script>`
  - Add font preload links for Outfit and Inter.
  - Link `assets/fonts/fonts.min.css` and update cache version query strings (`?v=20260821_v300`).
  - Add Theme Toggle button (`#btnThemeToggle`) to header actions.
  - Modernize Brand badge and action buttons.
  - Synchronize identical markup to `404.html`.
- **DoD**: Both HTML files contain Anti-FOUC, font preload, theme toggle button, and matching cache versions.

### Chunk 4: App Logic, Theme Switcher & Markdown Parser Update
- **Scope**: `assets/js/app.js`
- **Details**:
  - Add Theme Toggle handler supporting dark/light mode with persistence to `localStorage.getItem('theme')`.
  - Update `renderWelcomeScreen()` with standard category badges (`[ PERKENALAN ]`, `[ IDE ]`, `[ REFLEKSI ]`, `[ TEKNIS ]`) and `Mulai Diskusi ->` prompt cards.
  - Update avatar rendering (`[Z]` & `[U]`), code block wrapper with sibling copy button, and monochrome typing indicator dots.
  - Update error/info alert rendering to match zyekh.com callout standards.
- **DoD**: `node -c assets/js/app.js` exits with code 0.

### Chunk 5: Embeddable Widget Palette Alignment
- **Scope**: `chat-widget.js` and `assets/js/chat-widget.min.js`
- **Details**:
  - Replace `#090d16`, `#0f172a`, `#38bdf8` with monochrome zinc system (`#09090b`, `#141417`, `#27272a`, `#fafafa`).
  - Retain full functionality of embeddable popup widget.
- **DoD**: `node -c chat-widget.js` exits with code 0.

### Chunk 6: Silent Quality Gate & Empirical Verification
- **Scope**: Entire repository
- **Details**:
  - Execute `python3 check_emojis.py` (ensure 0 emojis).
  - Execute syntax validation for all JS files.
  - Create local checkpoint commit.
- **DoD**: 0 emojis detected, all syntax checks return 0, local git commit created.
