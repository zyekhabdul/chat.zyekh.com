(function () {
  'use strict';

  // Config & State
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal 
    ? (window.location.port === '3000' ? '' : (window.location.port === '3001' ? '' : 'http://localhost:3000'))
    : 'https://api.zyekh.com';
  const SESSIONS_KEY = 'zyekh_companion_sessions';
  const ACTIVE_SESSION_KEY = 'zyekh_active_companion_session_id';

  let sessions = loadSessions();
  let currentSessionId = localStorage.getItem(ACTIVE_SESSION_KEY);

  if (!currentSessionId || !sessions.find((s) => s.id === currentSessionId)) {
    currentSessionId = getOrCreateActiveSession();
  }

  // DOM Elements
  const historyList = document.getElementById('historyList');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const btnNewChat = document.getElementById('btnNewChat');
  const btnMenuToggle = document.getElementById('btnMenuToggle');
  const btnClearChat = document.getElementById('btnClearChat');
  const sidebar = document.getElementById('sidebar');

  // Initialization
  function init() {
    renderHistoryList();
    loadSessionToView(currentSessionId);

    // Event: Obrolan Baru
    btnNewChat.addEventListener('click', () => {
      const activeSess = getSession(currentSessionId);
      if (activeSess && activeSess.messages.length === 0) {
        chatInput.focus();
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
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
      loadSessionToView(newId);
      if (window.innerWidth <= 768) sidebar.classList.remove('open');
      chatInput.focus();
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
      }
    });

    // Event: Sidebar Mobile Toggle
    btnMenuToggle?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Event: Submit Pesan
    chatForm.addEventListener('submit', handleSendMessage);

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
      }
    });

    // Event: Auto-resize Textarea
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
    });
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
    historyList.innerHTML = '';
    sessions.forEach((sess) => {
      const item = document.createElement('div');
      item.className = `history-item ${sess.id === currentSessionId ? 'active' : ''}`;
      item.innerHTML = `
        <span style="overflow:hidden; text-overflow:ellipsis; flex:1;">${escapeHtml(sess.title)}</span>
        <button class="btn-del-sess" title="Hapus Obrolan" style="background:none;border:none;color:var(--text-faint);cursor:pointer;padding:2px 6px;font-size:14px;">&times;</button>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-del-sess')) {
          e.stopPropagation();
          deleteSession(sess.id);
          return;
        }
        loadSessionToView(sess.id);
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
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
    chatInput.focus();
  }

  function renderWelcomeScreen() {
    const welcome = document.createElement('div');
    welcome.className = 'chat-welcome';
    welcome.innerHTML = `
      <h2 class="welcome-title">Hai! Mau ngobrol atau bahas apa hari ini?</h2>
      <p class="welcome-subtitle">Saya adalah Zyekh AI Companion — siap jadi teman ngobrol santai, bertukar pikiran, brainstorming ide kreatif, atau diskusi mendalam.</p>
      <div class="suggestions-grid">
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Hai! Kenalin diri kamu dong, gaya ngobrol dan apa saja yang bisa kita bahas?')">
          <h4>💬 Ngobrol & Perkenalan</h4>
          <p>Kenali kemampuan dan gaya ngobrol asisten companion.</p>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Gw lagi punya ide proyek menarik, bantu gw brainstorming konsepnya yuk!')">
          <h4>💡 Brainstorming Ide Proyek</h4>
          <p>Eksplorasi konsep, validasi ide, dan rencana langkah kerja.</p>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Gimana tips produktivitas dan fokus ngoding tanpa gampang burnout?')">
          <h4>🌱 Refleksi & Produktivitas</h4>
          <p>Diskusi manajemen energi, fokus, dan pengembangan diri.</p>
        </div>
        <div class="suggestion-card" onclick="sendSuggestedPrompt('Bahas konsep arsitektur software dan optimasi performa modern yuk!')">
          <h4>⚡ Diskusi Teknis & Arsitektur</h4>
          <p>Pembahasan teknologi, desain sistem, dan prinsip rekayasa.</p>
        </div>
      </div>
    `;
    chatMessages.appendChild(welcome);
  }

  window.sendSuggestedPrompt = function (text) {
    chatInput.value = text;
    chatForm.requestSubmit();
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
      appendMessageElement('bot', `⚠️ Maaf, gagal terhubung ke Zyekh AI Core API (${err.message}). Pastikan server aktif.`);
    } finally {
      btnSend.disabled = false;
      chatInput.focus();
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
    content.querySelectorAll('pre').forEach((pre) => {
      const btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(code);
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy'), 2000);
      });
      pre.appendChild(btn);
    });
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'message-row bot';
    row.id = 'activeTypingRow';
    row.innerHTML = `
      <div class="avatar bot">Z</div>
      <div class="message-content" style="display:flex; gap:5px; padding:12px 18px; align-items:center;">
        <span style="display:inline-block; width:6px; height:6px; background:#38bdf8; border-radius:50%; animation:zyekhPulse 1.2s infinite ease-in-out;"></span>
        <span style="display:inline-block; width:6px; height:6px; background:#38bdf8; border-radius:50%; animation:zyekhPulse 1.2s infinite ease-in-out; animation-delay:0.2s;"></span>
        <span style="display:inline-block; width:6px; height:6px; background:#38bdf8; border-radius:50%; animation:zyekhPulse 1.2s infinite ease-in-out; animation-delay:0.4s;"></span>
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

  function formatMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    // Code blocks
    html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    // Links
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Lists
    html = html.replace(/^\s*•\s*(.*)$/gm, '<li>$1</li>');
    html = html.replace(/^\s*-\s*(.*)$/gm, '<li>$1</li>');
    // Newlines
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Run
  document.addEventListener('DOMContentLoaded', init);
})();
