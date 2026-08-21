# COMMUNITY LAUNCH KIT & VIRAL DISTRIBUTION ASSETS (CHAT.ZYEKH.COM)

- **Target Application**: [Zyekh AI](https://chat.zyekh.com/)
- **Repository**: `zyekhabdul/chat.zyekh.com`
- **Architecture**: Zero-Framework Vanilla ESNext, 100/100 Lighthouse, Multi-Model AI Routing, Local-First Multi-Session Storage.

---

## 1. Hacker News (Show HN) Package

- **Title**: `Show HN: Zyekh AI – Zero-framework, multi-model AI assistant and embeddable widget`
- **URL**: `https://chat.zyekh.com/`
- **Body / Pitch**:
```markdown
Hey HN,

I built Zyekh AI (https://chat.zyekh.com/) because modern AI chat web applications have become excessively bloated with client-side JavaScript, telemetry scripts, hydration delays, and heavy subscription paywalls.

What we built:
1. Zero-Framework Architecture: Pure native HTML5, modern CSS Custom Properties, and Vanilla ESNext. Zero React/Vue/Svelte dependencies. Initial page weight is ~14KB, achieving a 100/100 Google Lighthouse score.
2. Dynamic Multi-Model Gateway: Switch seamlessly between Gemini 3.7 Flash High, Claude 3.7 Sonnet, DeepSeek Reasoning, and open coding models via our sovereign backend proxy.
3. Thought Accordion: Real-time reasoning and internal chain-of-thought traces are neatly packaged inside collapsible UI containers instead of cluttering the chat stream.
4. Local-First Privacy: Multi-session chat history, custom avatar preferences, and system prompt instructions reside exclusively inside browser localStorage. Zero telemetry or user-data hoarding.
5. 14KB Embeddable Chat Widget: Any website can embed a fully functional AI assistant by adding a single `<script src="https://chat.zyekh.com/chat-widget.js" defer></script>` tag.
6. Programmatic Public Snapshots: 1-click shareable conversation links (e.g. /s/<id>) rendered server-side with Schema.org QAPage microdata for search indexing.

Live Demo: https://chat.zyekh.com/
Source & Architecture: https://github.com/zyekhabdul/chat.zyekh.com

Would love feedback on performance, UI polish, and feature ideas!
```

---

## 2. Technical Engineering Case Study (Dev.to / Hashnode / Medium)

- **Target Platforms**: Dev.to, Hashnode, Medium (Better Programming)
- **Title**: *"Why I Built a Zero-Framework AI: 100/100 Lighthouse, Multi-Model Routing, and 14KB Footprint"*
- **Tags**: `#webdev`, `#javascript`, `#ai`, `#architecture`, `#performance`

### Article Draft

```markdown
# Why I Built a Zero-Framework AI: 100/100 Lighthouse, Multi-Model Routing, and 14KB Footprint

When building AI web applications in 2026, the default reflex is often to reach for heavy full-stack frameworks (Next.js, Remix, Vite+React). But for conversational AI interfaces, this standard approach introduces distinct bottlenecks:
- Heavy client-side JavaScript bundles (often 200KB - 500KB+ before the first message is sent).
- Hydration latency and main-thread blocking during real-time token streaming.
- Unnecessary server-side state tracking when conversation histories naturally belong to the user.

To solve this, I designed **Zyekh AI** (https://chat.zyekh.com/) using a strict **Zero-Framework Architecture**. Here is what I learned and how it works.

---

## 1. The 14KB Vanilla Architecture

The frontend consists entirely of standard web technologies:
- `index.html` — Clean semantic HTML structure with pre-rendered CSS and Schema.org metadata.
- `assets/css/app.css` — Modern CSS Custom Properties, flexbox/grid layout, and solid zinc dark mode.
- `assets/js/app.js` — Native ESNext module handling session history, real-time message rendering, markdown parsing, and model switching.

### Performance Benchmarks
- First Contentful Paint (FCP): < 180ms
- Time to Interactive (TTI): < 220ms
- Memory Footprint: ~12MB in Chrome (vs ~95MB for heavy React-based chat apps)
- Lighthouse Score: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO.

---

## 2. Multi-Model AI Routing & Real-Time Reasoning

The application connects to a sovereign Express gateway that discovers backend AI inference nodes (Gemini 3.7 Flash, Claude 3.7 Sonnet, Deep Reasoning).

When reasoning models return internal thinking chains, the client parses the stream dynamically into a clean `<details class="thought-box">` accordion. Users see the final response instantly while retaining full visibility into the AI's step-by-step logic.

---

## 3. Omnichannel 14KB Embed Widget

To turn the companion into an embeddable ecosystem tool, we created `chat-widget.js`. Any developer or store owner can drop it onto their site with a single line:

```html
<script src="https://chat.zyekh.com/chat-widget.js" data-persona="tech_mentor" defer></script>
```

The widget creates an isolated Shadow DOM or scoped container, handles floating trigger interactions, persists session history in localStorage, and passes contextual PageRank back to the main hub.

---

## 4. Key Takeaway

You do not always need 50 npm dependencies and a heavy runtime framework to build an exceptional AI user experience. By leaning into native browser capabilities, you gain instant load times, zero maintenance overhead, and a smooth user experience.

- Live Application: [chat.zyekh.com](https://chat.zyekh.com/)
- Ecosystem Portal: [zyekh.com](https://zyekh.com/)
```

---

## 3. Reddit Community Distribution Blueprints

### Blueprint A: `r/webdev`
- **Title**: *"I built an AI companion web app using 100% Vanilla JS and CSS Custom Properties (14KB total weight, 100/100 Lighthouse)"*
- **Focus**: Bundle size comparison, memory efficiency, native DOM streaming.

### Blueprint B: `r/SelfHosted`
- **Title**: *"Local-First, Zero-Telemetry AI Chat with Docker & Express Gateway"*
- **Focus**: Sovereignty, no cloud tracking, multi-model backend switching.

### Blueprint C: `r/SideProject`
- **Title**: *"Show SideProject: Zyekh AI – Clean minimalist chat companion with embeddable widget"*
- **Focus**: Live demo, UI design, developer widget feedback.

---

## 4. Top Curated AI Directory Submissions

| Directory | Submission URL | Key Selling Point |
| :--- | :--- | :--- |
| **There's An AI For That** | `https://theresanaiforthat.com/submit/` | Zero-framework multi-model conversational assistant |
| **Futurepedia** | `https://www.futurepedia.io/submit-tool` | Free developer & tech mentor companion |
| **Toolify.ai** | `https://www.toolify.ai/submit` | Fast AI chat app & embeddable widget |
| **AlternativeTo** | `https://alternativeto.net/add-app/` | Lightweight alternative to ChatGPT & Claude web app |
| **Product Hunt** | `https://www.producthunt.com/posts/new` | Multi-model companion with local-first privacy |
