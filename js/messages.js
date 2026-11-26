/* ==========================================================================
   Pivot Pioneers — Internal Messaging Workspace (Socket.IO-Ready Adapter)
   ========================================================================== */

(function (window) {
  'use strict';

  const App = window.PivotApp;
  const { loadState, saveState, escapeHtml, initials, formatTime, SocketAdapter } = App;

  let activeConvId = null;

  document.addEventListener('DOMContentLoaded', () => {
    const user = App.renderAppShell('messages');
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    activeConvId = params.get('conv') || null;

    // Socket.IO-ready subscription hook
    SocketAdapter.on('message:new', () => {
      renderMessagesWorkspace(user);
    });

    renderMessagesWorkspace(user);
  });

  function renderMessagesWorkspace(user, searchQuery = '') {
    const root = document.getElementById('messagesContent');
    if (!root) return;

    const state = loadState();
    const myConvs = state.conversations.filter((c) => c.participants.includes(user.id));

    if (!activeConvId && myConvs.length) {
      activeConvId = myConvs[0].id;
    }

    const activeConv = myConvs.find((c) => c.id === activeConvId) || null;
    if (activeConv && activeConv.unreadBy && activeConv.unreadBy[user.id]) {
      activeConv.unreadBy[user.id] = 0;
      saveState(state);
    }

    const q = searchQuery.trim().toLowerCase();
    const filteredConvs = myConvs.filter((c) => {
      const otherId = c.participants.find((id) => id !== user.id);
      const other = state.users.find((u) => u.id === otherId);
      const proj = state.projects.find((p) => p.id === c.projectId);
      if (!q) return true;
      return (
        (other?.fullName || '').toLowerCase().includes(q) ||
        (proj?.title || '').toLowerCase().includes(q)
      );
    });

    const otherUserId = activeConv?.participants.find((id) => id !== user.id);
    const otherUser = state.users.find((u) => u.id === otherUserId);
    const activeProject = state.projects.find((p) => p.id === activeConv?.projectId);

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Messages</h1>
          <p>Collaborate directly with project partners (Local demo storage · Socket.IO-ready).</p>
        </div>
      </div>

      <section class="messages-shell">
        <aside class="glass-panel conv-pane">
          <input type="search" id="convSearchInput" class="form-control" placeholder="Search conversations..." value="${escapeHtml(searchQuery)}" />
          <div class="conv-list">
            ${
              filteredConvs.length === 0
                ? '<div class="text-sm text-muted" style="padding:18px;text-align:center;">No conversations found.</div>'
                : filteredConvs
                    .map((c) => {
                      const pid = c.participants.find((id) => id !== user.id);
                      const partner = state.users.find((u) => u.id === pid);
                      const proj = state.projects.find((p) => p.id === c.projectId);
                      const lastMsg = c.messages[c.messages.length - 1];
                      const unread = c.unreadBy?.[user.id] || 0;
                      return `
                        <button type="button" class="conv-item ${c.id === activeConv?.id ? 'active' : ''}" data-conv-id="${c.id}">
                          <div class="avatar avatar-sm">${escapeHtml(initials(partner?.fullName || 'U'))}</div>
                          <div style="min-width:0;flex:1;">
                            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                              <strong style="font-size:0.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(partner?.fullName || 'Member')}</strong>
                              ${unread ? `<span class="sidebar-badge">${unread}</span>` : ''}
                            </div>
                            <div class="text-xs text-muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                              ${escapeHtml(proj?.title || 'Direct Collaboration')}
                            </div>
                            <div class="text-xs text-muted" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                              ${lastMsg ? escapeHtml(lastMsg.text) : 'No messages yet'}
                            </div>
                          </div>
                        </button>
                      `;
                    })
                    .join('')
            }
          </div>
        </aside>

        <div class="glass-panel chat-pane">
          ${
            activeConv && otherUser
              ? `
                <div class="chat-header">
                  <a href="profile.html?id=${otherUser.id}" class="client-chip">
                    <div class="avatar">${escapeHtml(initials(otherUser.fullName))}</div>
                    <div>
                      <div style="font-weight:700;">${escapeHtml(otherUser.fullName)}</div>
                      <div class="text-xs text-muted">${escapeHtml(activeProject?.title || 'Direct Collaboration')}</div>
                    </div>
                  </a>
                  <a href="profile.html?id=${otherUser.id}" class="btn btn-glass btn-sm">View Profile</a>
                </div>

                <div class="chat-messages" id="chatMessagesBox">
                  ${
                    activeConv.messages.length
                      ? activeConv.messages
                          .map(
                            (m) => `
                          <div class="msg-bubble ${m.senderId === user.id ? 'mine' : ''}">
                            <div>${escapeHtml(m.text)}</div>
                            <span class="msg-time">${formatTime(m.timestamp)}</span>
                          </div>
                        `
                          )
                          .join('')
                      : '<div class="text-sm text-muted" style="margin:auto;">Start the conversation below.</div>'
                  }
                </div>

                <form class="chat-composer" id="chatSendForm">
                  <input type="text" id="chatMessageInput" class="form-control" placeholder="Write a message..." autocomplete="off" required />
                  <button type="submit" class="btn btn-primary">Send</button>
                </form>
              `
              : `
                <div class="empty-state" style="margin:auto;border:none;background:transparent;">
                  <h3>Select a Conversation</h3>
                  <p>Conversations open automatically when you message a client or review project applicants.</p>
                </div>
              `
          }
        </div>
      </section>
    `;

    const msgBox = document.getElementById('chatMessagesBox');
    if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;

    document.getElementById('convSearchInput')?.addEventListener('input', (e) => {
      renderMessagesWorkspace(user, e.target.value);
    });

    root.querySelectorAll('[data-conv-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeConvId = btn.dataset.convId;
        renderMessagesWorkspace(user, document.getElementById('convSearchInput')?.value || '');
      });
    });

    document.getElementById('chatSendForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chatMessageInput');
      const text = (input?.value || '').trim();
      if (!text || !activeConv) return;

      const fresh = loadState();
      const conv = fresh.conversations.find((c) => c.id === activeConv.id);
      if (!conv) return;

      const newMsg = {
        id: 'm_' + Date.now(),
        senderId: user.id,
        text,
        timestamp: new Date().toISOString()
      };
      conv.messages.push(newMsg);
      const recipientId = conv.participants.find((id) => id !== user.id);
      if (recipientId) {
        if (!conv.unreadBy) conv.unreadBy = {};
        conv.unreadBy[recipientId] = (conv.unreadBy[recipientId] || 0) + 1;
      }
      saveState(fresh);

      if (recipientId) {
        App.addNotification(recipientId, {
          type: 'message',
          title: `New Message from ${user.fullName}`,
          body: text.slice(0, 90),
          link: `messages.html?conv=${conv.id}`
        });
      }

      SocketAdapter.emit('message:new', newMsg);
    });
  }
})(window);
