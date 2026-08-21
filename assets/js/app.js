(function () {
  'use strict';

  // Config & State
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal 
    ? (window.location.port === '3000' ? '' : (window.location.port === '3001' ? '' : 'http://localhost:3000'))
    : 'https://api.zyekh.com';
  const SESSIONS_KEY = 'zyekh_companion_sessions';
  const ACTIVE_SESSION_KEY = 'zyekh_active_companion_session_id';
  const THEME_KEY = 'theme';

  let sessions = loadSessions();
  let currentSessionId = localStorage.getItem(ACTIVE_SESSION_KEY);
  let searchQuery = '';

  if (!currentSessionId || !sessions.find((s) => s.id === currentSessionId)) {
    currentSessionId = getOrCreateActiveSession();
  }

  // DOM Elements
  const historyList = document.getElementById('historyList');
  const sessionSearchInput = document.getElementById('sessionSearchInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const btnNewChat = document.getElementById('btnNewChat');
  const btnMenuToggle = document.getElementById('btnMenuToggle');
  const btnClearChat = document.getElementById('btnClearChat');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  // Sidebar Controls
  function openSidebar() {
    sidebar?.classList.add('open');
    sidebarBackdrop?.classList.add('open');
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarBackdrop?.classList.remove('open');
  }

  function toggleSidebar() {
    if (sidebar?.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // Toast Notification System (Monochrome Parity)
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  }

  // Initialization
  function init() {
    initTheme();
    renderHistoryList();
    loadSessionToView(currentSessionId);

    // Event: Theme Toggle
    btnThemeToggle?.addEventListener('click', toggleTheme);

    // Event: Search Filter Riwayat Sesi
    sessionSearchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderHistoryList();
    });

    // Event: Obrolan Baru
    btnNewChat?.addEventListener('click', () => {
      const activeSess = getSession(currentSessionId);
      if (activeSess && activeSess.messages.length === 0) {
        chatInput?.focus();
        closeSidebar();
        return;
      }

      const newId = 'sess_' + Date.now();
      const newSess = {
        id: newId,
        title: 'Obrolan Baru',
        createdAt: new Date().toISOString(),
        messages: []
      };
      sessions.unshift(newSess);
      saveSessions();
      searchQuery = '';
      if (sessionSearchInput) sessionSearchInput.value = '';
      loadSessionToView(newId);
      closeSidebar();
      chatInput?.focus();
      showToast('[ INFO ] Sesi obrolan baru siap digunakan');
    });

    // Event: Bersihkan Obrolan Aktif
    btnClearChat?.addEventListener('click', () => {
      const sess = getSession(currentSessionId);
      if (sess && sess.messages.length > 0) {
        sess.messages = [];
        sess.title = 'Obrolan Baru';
        saveSessions();
        renderHistoryList();
        loadSessionToView(currentSessionId);
        showToast('[ INFO ] Riwayat obrolan aktif telah dibersihkan');
      }
    });

    // Event: Sidebar Mobile Toggle & Backdrop Dismiss
    btnMenuToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    sidebarBackdrop?.addEventListener('click', closeSidebar);

    document.addEventListener('click', (e) => {
      if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !btnMenuToggle?.contains(e.target)) {
        closeSidebar();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    });

    // Event: Submit Pesan
    chatForm?.addEventListener('submit', handleSendMessage);

    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
      }
    });

    // Event: Auto-resize Textarea
    chatInput?.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
    });
  }

  // Theme Management (Anti-FOUC Parity with zyekh.com)
  function initTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeUI(activeTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    updateThemeUI(next);
    showToast(`[ THEME ] Mode diubah ke ${next === 'light' ? 'Terang (Light)' : 'Gelap (Dark)'}`);
  }

  function updateThemeUI(theme) {
    if (themeLabel) {
      themeLabel.textContent = theme === 'light' ? 'Light' : 'Dark';
    }
  }

  // Session Helpers
  function loadSessions() {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSessions() {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  function getOrCreateActiveSession() {
    if (sessions.length > 0) {
      return sessions[0].id;
    }
    const id = 'sess_' + Date.now();
    const newSess = {
      id,
      title: 'Obrolan Baru',
      createdAt: new Date().toISOString(),
      messages: []
    };
    sessions = [newSess];
    saveSessions();
    return id;
  }

  function getSession(id) {
    return sessions.find((s) => s.id === id);
  }

  function renderHistoryList() {
    if (!historyList) return;
    historyList.innerHTML = '';

    const filtered = searchQuery 
      ? sessions.filter((s) => s.title.toLowerCase().includes(searchQuery))
      : sessions;

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'history-empty';
      empty.textContent = searchQuery ? '[ INFO ] Tidak ada riwayat yang cocok' : '[ INFO ] Belum ada riwayat obrolan';
      historyList.appendChild(empty);
      return;
    }

    filtered.forEach((sess) => {
      const item = document.createElement('div');
      item.className = `history-item ${sess.id === currentSessionId ? 'active' : ''}`;
      item.innerHTML = `
        <span style="overflow:hidden; text-overflow:ellipsis; flex:1;">${escapeHtml(sess.title)}</span>
        <button class="btn-del-sess" title="Hapus Obrolan" aria-label="Hapus">&times;</button>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-del-sess')) {
          e.stopPropagation();
          deleteSession(sess.id);
          return;
        }
        loadSessionToView(sess.id);
        closeSidebar();
      });

      historyList.appendChild(item);
    });
  }

  function deleteSession(id) {
    sessions = sessions.filter((s) => s.id !== id);
    if (sessions.length === 0) {
      currentSessionId = getOrCreateActiveSession();
    } else if (currentSessionId === id) {
      currentSessionId = sessions[0].id;
    }
    saveSessions();
    renderHistoryList();
    loadSessionToView(currentSessionId);
    showToast('[ INFO ] Sesi obrolan dihapus');
  }

  function loadSessionToView(sessionId) {
    currentSessionId = sessionId;
    localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
    renderHistoryList();

    const sess = getSession(sessionId);
    if (!sess) return;

    chatMessages.innerHTML = '';

    if (sess.messages.length === 0) {
      renderWelcomeScreen();
    } else {
      sess.messages.forEach((msg) => {
        appendMessageElement(msg.role, msg.content);
      });
    }
    chatInput?.focus();
  }

  // Welcome Screen (Standard B Card Architecture from zyekh.com)
  function renderWelcomeScreen() {
    const welcome = document.createElement('div');
    welcome.className = 'chat-welcome';
    welcome.innerHTML = `
      <span class="welcome-badge">ZYEKH AI COMPANION</span>
      <h2 class="welcome-title">Hai! Mau ngobrol atau bahas apa hari ini?</h2>
      <p class="welcome-subtitle">Saya adalah Zyekh AI Companion — siap jadi teman ngobrol santai, bertukar pikiran, brainstorming ide kreatif, atau diskusi arsitektur mendalam.</p>
      <div class="suggestions-grid">
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Hai! Kenalin diri kamu dong, gaya ngobrol dan apa saja yang bisa kita bahas?')">
          <div>
            <span class="suggestion-cat">[ PERKENALAN ]</span>
            <h3 class="suggestion-title">Ngobrol &amp; Perkenalan</h3>
            <p class="suggestion-desc">Kenali kemampuan, persona ramah, dan gaya ngobrol asisten companion.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Gw lagi punya ide proyek menarik, bantu gw brainstorming konsepnya yuk!')">
          <div>
            <span class="suggestion-cat">[ IDE ]</span>
            <h3 class="suggestion-title">Brainstorming Proyek</h3>
            <p class="suggestion-desc">Eksplorasi konsep, validasi ide, dan susun rencana langkah kerja terukur.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Gimana tips produktivitas dan fokus ngoding tanpa gampang burnout?')">
          <div>
            <span class="suggestion-cat">[ REFLEKSI ]</span>
            <h3 class="suggestion-title">Refleksi &amp; Produktivitas</h3>
            <p class="suggestion-desc">Diskusi manajemen energi, fokus, dan pengembangan diri jangka panjang.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Bahas konsep arsitektur software dan optimasi performa modern yuk!')">
          <div>
            <span class="suggestion-cat">[ TEKNIS ]</span>
            <h3 class="suggestion-title">Teknis &amp; Arsitektur</h3>
            <p class="suggestion-desc">Pembahasan teknologi, desain sistem modern, dan prinsip rekayasa bersih.</p>
          </div>
          <span class="suggestion-action">Mulai Diskusi &rarr;</span>
        </div>
      </div>
    `;
    chatMessages.appendChild(welcome);
  }

  window.sendSuggestedPrompt = function (text) {
    if (chatInput && chatForm) {
      chatInput.value = text;
      chatForm.requestSubmit();
    }
  };

  // Message Handling
  async function handleSendMessage(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    let sess = getSession(currentSessionId);
    if (!sess) {
      currentSessionId = getOrCreateActiveSession();
      sess = getSession(currentSessionId);
    }

    // Update judul sesi jika pesan pertama
    if (sess.messages.length === 0) {
      chatMessages.innerHTML = '';
      sess.title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      renderHistoryList();
    }

    // Append User Message
    sess.messages.push({ role: 'user', content: text });
    saveSessions();
    appendMessageElement('user', text);

    chatInput.value = '';
    chatInput.style.height = 'auto';
    btnSend.disabled = true;
    showTypingIndicator();

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatId: currentSessionId,
          persona: 'companion',
          channel: 'chat.zyekh.com'
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      removeTypingIndicator();

      const botReply = data && data.reply ? data.reply : 'Maaf, terjadi kendala saat merespon obrolan.';
      sess.messages.push({ role: 'assistant', content: botReply });
      saveSessions();
      appendMessageElement('bot', botReply);
    } catch (err) {
      removeTypingIndicator();
      appendMessageElement('bot', `[ ERROR ] Gagal terhubung ke Zyekh AI Core API (${err.message}). Pastikan server aktif.`);
    } finally {
      btnSend.disabled = false;
      chatInput?.focus();
    }
  }

  function appendMessageElement(role, text) {
    const row = document.createElement('div');
    row.className = `message-row ${role === 'user' ? 'user' : 'bot'}`;

    const avatar = document.createElement('div');
    avatar.className = `avatar ${role === 'user' ? 'user' : 'bot'}`;
    avatar.textContent = role === 'user' ? 'U' : 'Z';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = role === 'user' ? escapeHtml(text).replace(/\n/g, '<br>') : formatMarkdown(text);

    row.appendChild(avatar);
    row.appendChild(content);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Attach copy button to code blocks
    content.querySelectorAll('.copy-code-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wrapper = btn.closest('.code-block-wrapper') || btn.closest('pre');
        const code = wrapper?.querySelector('code')?.innerText || '';
        if (code) {
          navigator.clipboard.writeText(code);
          btn.textContent = 'Copied!';
          showToast('[ VERIFIED ] Kode berhasil disalin ke clipboard');
          setTimeout(() => (btn.textContent = 'Copy'), 2000);
        }
      });
    });
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'message-row bot';
    row.id = 'activeTypingRow';
    row.innerHTML = `
      <div class="avatar bot">Z</div>
      <div class="message-content" style="display:flex; gap:6px; padding:12px 18px; align-items:center;">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('activeTypingRow');
    if (el) el.remove();
  }

  // Utilities
  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Rich Markdown Engine (Tables, Callouts, Headings, Code Headers)
  function formatMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);

    // 1. Code blocks with language detection and header
    html = html.replace(/```([a-zA-Z0-9_\-#+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const displayLang = (lang || 'CODE').toUpperCase();
      return `<div class="code-block-wrapper">` +
             `<div class="code-block-header">` +
               `<span class="code-lang">${displayLang}</span>` +
               `<button class="copy-code-btn" type="button" aria-label="Copy Code">Copy</button>` +
             `</div>` +
             `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>` +
             `</div>`;
    });

    // 2. Blockquotes / Callouts (> text)
    html = html.replace(/^(?:&gt;|>)[ \t]?(.*)$/gm, '<div class="callout"><p>$1</p></div>');

    // 3. Headings (###, ##, #)
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h4>$1</h4>');

    // 4. Tables (| Header | Header |)
    html = html.replace(/((?:\|[^\n]+\|\r?\n?){2,})/g, (tableMatch) => {
      const lines = tableMatch.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return tableMatch;
      
      let tableHtml = '<table>';
      let isHeaderDone = false;

      lines.forEach((line, idx) => {
        if (/^\|[-:\s|]+\|$/.test(line)) {
          isHeaderDone = true;
          return;
        }
        const cells = line.split('|').slice(1, -1).map(c => c.trim());
        if (!isHeaderDone && idx === 0) {
          tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      });
      tableHtml += '</tbody></table>';
      return tableHtml;
    });

    // 5. Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 6. Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // 7. Links
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // 8. Lists
    html = html.replace(/^\s*•\s*(.*)$/gm, '<li>$1</li>');
    html = html.replace(/^\s*-\s*(.*)$/gm, '<li>$1</li>');

    // 9. Newlines (avoiding breaking table/pre tags)
    html = html.replace(/(?<!<\/li>|<\/h[1-6]>|<\/table>|<\/tbody>|<\/tr>|<\/thead>|<\/div>|<\/p>)\n/g, '<br>');

    return html;
  }

  // Run
  document.addEventListener('DOMContentLoaded', init);
})();
