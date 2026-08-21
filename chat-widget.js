(function () {
  'use strict';

  // Cegah inisialisasi ganda
  if (window.__ZYEKH_CHAT_WIDGET_LOADED__) return;
  window.__ZYEKH_CHAT_WIDGET_LOADED__ = true;

  // Baca konfigurasi dari script tag saat ini
  const currentScript = document.currentScript || document.querySelector('script[src*="chat-widget"]');
  const API_BASE = currentScript?.getAttribute('data-api') || (window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://api.zyekh.com');
  const PERSONA = currentScript?.getAttribute('data-persona') || 'cs_store';
  const CHAT_TITLE = currentScript?.getAttribute('data-title') || (PERSONA === 'tech_mentor' ? 'Zyekh AI Mentor' : PERSONA === 'cloud_assistant' ? 'Zyekh Cloud AI' : 'Zyekh Assistant');
  const CHAT_SUBTITLE = currentScript?.getAttribute('data-subtitle') || 'Online • High-Speed AI Brain';

  const STORAGE_KEY = `zyekh_chat_${PERSONA}_history`;
  const CHAT_ID_KEY = 'zyekh_chat_user_id';

  let userId = localStorage.getItem(CHAT_ID_KEY);
  if (!userId) {
    userId = 'usr_' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(CHAT_ID_KEY, userId);
  }

  // Inject Styles (Pure Monochrome Zinc Parity)
  const style = document.createElement('style');
  style.innerHTML = `
    .zyekh-chat-toggle {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #141417;
      color: #fafafa;
      border: 1px solid #27272a;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .zyekh-chat-toggle:hover {
      transform: scale(1.06);
      border-color: #52525b;
      box-shadow: 0 12px 28px rgba(255, 255, 255, 0.08);
    }
    .zyekh-chat-toggle svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
    .zyekh-chat-window {
      position: fixed;
      bottom: 88px;
      right: 24px;
      width: 380px;
      height: 540px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 110px);
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px) scale(0.97);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .zyekh-chat-window.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }
    .zyekh-chat-header {
      padding: 14px 16px;
      background: #141417;
      border-bottom: 1px solid #27272a;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .zyekh-chat-header-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .zyekh-chat-header-title {
      font-size: 14px;
      font-weight: 700;
      color: #fafafa;
      letter-spacing: -0.01em;
    }
    .zyekh-chat-header-status {
      font-size: 11.5px;
      color: #a1a1aa;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .zyekh-chat-header-status::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #fafafa;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
    }
    .zyekh-chat-close {
      background: transparent;
      border: none;
      color: #71717a;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;
    }
    .zyekh-chat-close:hover {
      color: #fafafa;
    }
    .zyekh-chat-messages {
      flex: 1;
      padding: 14px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    .zyekh-chat-bubble {
      max-width: 86%;
      padding: 9px 13px;
      border-radius: 6px;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
    }
    .zyekh-chat-bubble.user {
      align-self: flex-end;
      background: #18181b;
      color: #fafafa;
      border: 1px solid #27272a;
    }
    .zyekh-chat-bubble.bot {
      align-self: flex-start;
      background: #141417;
      color: #fafafa;
      border: 1px solid #27272a;
    }
    .zyekh-chat-bubble p {
      margin: 0 0 6px 0;
    }
    .zyekh-chat-bubble p:last-child {
      margin-bottom: 0;
    }
    .zyekh-chat-bubble code {
      background: #000000;
      color: #fafafa;
      padding: 2px 5px;
      border: 1px solid #27272a;
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
      font-size: 12px;
    }
    .zyekh-chat-bubble pre {
      background: #000000;
      border: 1px solid #27272a;
      padding: 8px 10px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 6px 0;
      font-family: 'Fira Code', monospace;
    }
    .zyekh-chat-bubble a {
      color: #fafafa;
      text-decoration: underline;
    }
    .zyekh-chat-typing {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
      background: #141417;
      border: 1px solid #27272a;
      border-radius: 6px;
      align-self: flex-start;
      width: fit-content;
    }
    .zyekh-chat-typing span {
      width: 5px;
      height: 5px;
      background: #a1a1aa;
      border-radius: 50%;
      animation: zyekhPulse 1.2s infinite ease-in-out;
    }
    .zyekh-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .zyekh-chat-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes zyekhPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
      40% { transform: scale(1.1); opacity: 1; }
    }
    .zyekh-chat-input-area {
      padding: 10px 12px;
      border-top: 1px solid #27272a;
      background: #141417;
      display: flex;
      gap: 8px;
    }
    .zyekh-chat-input {
      flex: 1;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 4px;
      padding: 7px 10px;
      color: #fafafa;
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s;
      font-family: inherit;
    }
    .zyekh-chat-input:focus {
      border-color: #52525b;
    }
    .zyekh-chat-send {
      background: #fafafa;
      color: #09090b;
      border: 1px solid #fafafa;
      border-radius: 4px;
      padding: 0 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
    .zyekh-chat-header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .zyekh-chat-action-btn {
      background: transparent;
      border: none;
      color: #71717a;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;
      text-decoration: none;
    }
    .zyekh-chat-action-btn:hover {
      color: #fafafa;
    }
    .zyekh-chat-footer-attr {
      padding: 6px 12px 7px 12px;
      background: #09090b;
      border-top: 1px solid #18181b;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 10.5px;
      color: #71717a;
      letter-spacing: 0.01em;
      flex-shrink: 0;
    }
    .zyekh-chat-footer-attr a {
      color: #a1a1aa;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.15s;
    }
    .zyekh-chat-footer-attr a:hover {
      color: #fafafa;
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  // Helper Markdown formatter (Tokenized Architecture)
  function formatMarkdown(text) {
    if (!text) return '';
    let str = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const codeBlocks = [];
    const inlineCodes = [];

    // Extract Code blocks
    str = str.replace(/```([a-zA-Z0-9_\-#+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(`<pre style="background:#000;border:1px solid #27272a;border-radius:4px;padding:8px 10px;margin:6px 0;overflow-x:auto;font-family:monospace;font-size:12px;"><code>${code.trimEnd()}</code></pre>`);
      return `___CODEBLOCK_${idx}___`;
    });

    // Extract Inline code
    str = str.replace(/`([^`]+)`/g, (match, code) => {
      const idx = inlineCodes.length;
      inlineCodes.push(`<code style="background:#000;border:1px solid #27272a;border-radius:3px;padding:2px 4px;font-family:monospace;font-size:12px;">${code}</code>`);
      return `___INLINECODE_${idx}___`;
    });

    // Blockquotes / Callouts
    str = str.replace(/^&gt;\s?(.*)$/gm, '<div style="border-left:3px solid #fafafa;background:#18181b;padding:6px 10px;margin:6px 0;border-radius:0 3px 3px 0;"><p style="margin:0;">$1</p></div>');

    // Headings
    str = str.replace(/^### (.*$)/gm, '<h3 style="font-size:14px;margin:6px 0 2px 0;color:#fafafa;">$1</h3>');
    str = str.replace(/^## (.*$)/gm, '<h2 style="font-size:15px;margin:8px 0 3px 0;color:#fafafa;">$1</h2>');

    // Bold & Italic
    str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links
    str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#fafafa;text-decoration:underline;">$1</a>');

    // Lists
    str = str.replace(/((?:^[ \t]*(?:[•\-\*]|\d+\.)[ \t]+[^\n]+\r?\n?)+)/gm, (listMatch) => {
      const lines = listMatch.trim().split('\n');
      const isOrdered = /^[ \t]*\d+\./.test(lines[0]);
      const items = lines.map(line => {
        const content = line.replace(/^[ \t]*(?:[•\-\*]|\d+\.)[ \t]+/, '');
        return `<li style="margin-bottom:2px;">${content}</li>`;
      }).join('');
      return isOrdered ? `<ol style="margin:4px 0 6px 16px;">${items}</ol>` : `<ul style="margin:4px 0 6px 16px;">${items}</ul>`;
    });

    // Newlines
    str = str.replace(/(?<!<\/li>|<\/ul>|<\/ol>|<\/h[1-6]>|<\/div>|<\/p>)\n/g, '<br>');

    // Restore code tokens
    str = str.replace(/___CODEBLOCK_(\d+)___/g, (_, idx) => codeBlocks[Number(idx)] || '');
    str = str.replace(/___INLINECODE_(\d+)___/g, (_, idx) => inlineCodes[Number(idx)] || '');

    return str;
  }

  // Create UI Elements
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'zyekh-chat-toggle';
  toggleBtn.setAttribute('aria-label', 'Open Chat Assistant');
  toggleBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  `;

  const chatWindow = document.createElement('div');
  chatWindow.className = 'zyekh-chat-window';
  chatWindow.innerHTML = `
    <div class="zyekh-chat-header">
      <div class="zyekh-chat-header-info">
        <div class="zyekh-chat-header-title">${CHAT_TITLE}</div>
        <div class="zyekh-chat-header-status">${CHAT_SUBTITLE}</div>
      </div>
      <div class="zyekh-chat-header-actions">
        <a href="https://chat.zyekh.com/?utm_source=widget_expand&utm_medium=referral" target="_blank" rel="noopener" class="zyekh-chat-action-btn" title="Buka Aplikasi Penuh" aria-label="Buka Aplikasi Penuh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
        <button class="zyekh-chat-action-btn zyekh-chat-close" aria-label="Tutup Obrolan">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    <div class="zyekh-chat-messages" id="zyekhChatMessages"></div>
    <form class="zyekh-chat-input-area" id="zyekhChatForm">
      <input type="text" class="zyekh-chat-input" id="zyekhChatInput" placeholder="Ketik pesan..." autocomplete="off" />
      <button type="submit" class="zyekh-chat-send" id="zyekhChatSend">Kirim</button>
    </form>
    <div class="zyekh-chat-footer-attr">
      <span>Powered by</span>
      <a href="https://chat.zyekh.com/?utm_source=widget&utm_medium=referral&utm_campaign=ecosystem" target="_blank" rel="noopener">
        Zyekh AI Companion
      </a>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(chatWindow);

  const messagesContainer = chatWindow.querySelector('#zyekhChatMessages');
  const chatForm = chatWindow.querySelector('#zyekhChatForm');
  const chatInput = chatWindow.querySelector('#zyekhChatInput');
  const sendBtn = chatWindow.querySelector('#zyekhChatSend');
  const closeBtn = chatWindow.querySelector('.zyekh-chat-close');

  let isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open', isOpen);
    if (isOpen) {
      chatInput.focus();
      if (messagesContainer.children.length === 0) {
        appendBotMessage(
          PERSONA === 'tech_mentor'
            ? 'Hello. I am the Zyekh Technical Mentor. How can I assist with local-first tools, performance architecture, or security research today?'
            : PERSONA === 'cloud_assistant'
            ? 'Halo! Saya Zyekh Cloud Assistant. Ada file atau aset digital di Google Drive yang ingin Anda cari?'
            : 'Halo! Ada yang bisa kami bantu seputar produk akun premium atau tools AI hari ini?'
        );
      }
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  function appendUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'zyekh-chat-bubble user';
    el.textContent = text;
    messagesContainer.appendChild(el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'zyekh-chat-bubble bot';
    el.innerHTML = formatMarkdown(text);
    messagesContainer.appendChild(el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'zyekh-chat-typing';
    typing.id = 'zyekhTypingIndicator';
    typing.innerHTML = `<span></span><span></span><span></span>`;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('zyekhTypingIndicator');
    if (el) el.remove();
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    chatInput.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatId: userId,
          persona: PERSONA,
          channel: 'web'
        })
      });

      const data = await res.json();
      removeTyping();

      if (data && data.reply) {
        appendBotMessage(data.reply);
      } else {
        appendBotMessage('Maaf, tidak ada respon dari server.');
      }
    } catch (err) {
      removeTyping();
      appendBotMessage(`[ ERROR ] Gagal terhubung ke AI API (${err.message || 'Koneksi terputus'}). Pastikan backend aktif.`);
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  });
})();
