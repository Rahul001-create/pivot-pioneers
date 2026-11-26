/* ==========================================================================
   Pivot Pioneers — Overview (3x2), Feedback & Certificates, Settings
   ========================================================================== */

(function (window) {
  'use strict';

  const App = window.PivotApp;
  const { escapeHtml, formatDate, openModal, closeModal, showToast, loadState, saveState } = App;

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'overview';
    const navKey = view === 'certificates' ? 'certificates' : view === 'settings' ? 'settings' : 'overview';

    const user = App.renderAppShell(navKey);
    if (!user) return;

    if (view === 'certificates') {
      renderCertificatesView(user);
    } else if (view === 'settings') {
      renderSettingsView(user);
    } else {
      renderOverviewView(user);
    }
  });

  function renderOverviewView(user) {
    const root = document.getElementById('dashboardContent');
    if (!root) return;

    const isClient = user.role === 'client';
    const isFreelancer = user.role === 'freelancer';

    const cards = [
      {
        id: 'browse',
        title: 'Browse Projects',
        desc: 'Explore available projects and discover opportunities.',
        cta: 'Explore projects',
        href: 'projects.html?view=browse',
        allowed: true,
        roleTag: 'All Roles',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>'
      },
      {
        id: 'post',
        title: 'Post a Project',
        desc: 'Publish a project and find talented freelancers.',
        cta: isClient ? 'Create project' : 'Client access only',
        href: 'projects.html?view=post',
        allowed: isClient,
        requiredRole: 'client',
        roleTag: 'Client Action',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>'
      },
      {
        id: 'applications',
        title: 'My Applications',
        desc: 'Track submitted applications and their status.',
        cta: isFreelancer ? 'Track applications' : 'Freelancer access only',
        href: 'projects.html?view=applications',
        allowed: isFreelancer,
        requiredRole: 'freelancer',
        roleTag: 'Freelancer Action',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>'
      },
      {
        id: 'profile',
        title: 'My Profile',
        desc: 'Manage your profile, skills, resume, and portfolio.',
        cta: 'Open profile',
        href: 'profile.html',
        allowed: true,
        roleTag: 'All Roles',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>'
      },
      {
        id: 'applicants',
        title: 'Review Applicants',
        desc: 'Review applications and select suitable freelancers.',
        cta: isClient ? 'Review talent' : 'Client access only',
        href: 'projects.html?view=applicants',
        allowed: isClient,
        requiredRole: 'client',
        roleTag: 'Client Action',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
      },
      {
        id: 'certificates',
        title: 'Feedback & Certificates',
        desc: 'Track completed projects, feedback, and experience certificates.',
        cta: 'View records',
        href: 'dashboard.html?view=certificates',
        allowed: true,
        roleTag: 'All Roles',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>'
      }
    ];

    root.innerHTML = `
      <div class="overview-wrapper">
        <div class="page-header" style="margin-bottom:14px;">
          <div>
            <h1>Welcome back, ${escapeHtml(user.fullName)}</h1>
            <p>Signed in as <strong>${escapeHtml(user.role.toUpperCase())}</strong> (${escapeHtml(user.subRole || 'Demo')}) · Select a workspace module below</p>
          </div>
          <div style="display:flex;gap:10px;align-items:center;">
            <span class="badge badge-blue">Demo Mode · LocalStorage</span>
          </div>
        </div>

        <section class="overview-grid" aria-label="Dashboard overview cards">
          ${cards
            .map(
              (c) => `
            <button
              type="button"
              class="glass-card overview-card ${c.allowed ? '' : 'role-restricted'}"
              data-card-id="${c.id}"
              data-href="${c.href}"
              data-allowed="${c.allowed}"
              data-required-role="${c.requiredRole || ''}"
            >
              <div>
                <div class="overview-card-top">
                  <div class="overview-icon">${c.icon}</div>
                  <span class="badge ${c.allowed ? 'badge-blue' : 'badge-silver'}">${escapeHtml(c.roleTag)}</span>
                </div>
                <h2>${escapeHtml(c.title)}</h2>
                <p>${escapeHtml(c.desc)}</p>
              </div>
              <div class="overview-card-footer">
                <span>${escapeHtml(c.cta)}</span>
                <span aria-hidden="true">&rarr;</span>
              </div>
            </button>
          `
            )
            .join('')}
        </section>
      </div>
    `;

    root.querySelectorAll('.overview-card').forEach((card) => {
      card.addEventListener('click', () => {
        const allowed = card.dataset.allowed === 'true';
        const requiredRole = card.dataset.requiredRole;
        if (allowed) {
          window.location.href = card.dataset.href;
          return;
        }
        openModal(
          'Role Permission Notice',
          `
          <p style="margin-top:0;line-height:1.6;">
            <strong>${escapeHtml(card.querySelector('h2').textContent)}</strong> is restricted to
            <strong>${escapeHtml(requiredRole)}</strong> accounts. You are currently signed in as a
            <strong>${escapeHtml(user.role)}</strong>.
          </p>
          <p class="text-sm text-muted">
            Want to test this workflow right now? Switch to the Demo ${requiredRole === 'client' ? 'Client' : 'Freelancer'} session in one click.
          </p>
          <div class="form-actions">
            <button type="button" class="btn btn-glass" id="closePermModal">Stay as ${escapeHtml(user.role)}</button>
            <button type="button" class="btn btn-primary" id="switchRoleFromCard">Switch to Demo ${requiredRole === 'client' ? 'Client' : 'Freelancer'}</button>
          </div>
          `,
          '500px'
        );
        document.getElementById('closePermModal')?.addEventListener('click', closeModal);
        document.getElementById('switchRoleFromCard')?.addEventListener('click', () => {
          App.switchDemoRole(requiredRole);
        });
      });
    });
  }

  function renderCertificatesView(user) {
    const root = document.getElementById('dashboardContent');
    if (!root) return;

    const state = loadState();
    const completedProjects = state.projects.filter(
      (p) =>
        p.status === 'Completed' &&
        (p.clientId === user.id || (p.selectedFreelancerIds || []).includes(user.id))
    );

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Feedback &amp; Experience Certificates</h1>
          <p>Review completed collaborations, submit partner feedback, and print experience certificates.</p>
        </div>
        <a href="projects.html?view=my-projects" class="btn btn-glass">View My Projects</a>
      </div>

      <div class="glass-panel" style="padding:16px 20px;margin-bottom:20px;">
        <span class="badge badge-blue">Notice</span>
        <span class="text-sm text-muted" style="margin-left:8px;">
          Experience certificates below reflect completed projects recorded inside Pivot Pioneers local demo state and do not claim external accreditation.
        </span>
      </div>

      ${
        completedProjects.length === 0
          ? `
          <div class="empty-state">
            <h3>No Completed Projects Yet</h3>
            <p>Once a project moves through work submission and client approval, both feedback and your printable Experience Certificate appear here.</p>
            <a href="projects.html?view=my-projects" class="btn btn-primary">Go to My Projects</a>
          </div>
        `
          : `<div class="list-cards">${completedProjects
              .map((project) => {
                const client = state.users.find((u) => u.id === project.clientId);
                const freelancerId = (project.selectedFreelancerIds || [])[0];
                const freelancer = state.users.find((u) => u.id === freelancerId);
                const partner = user.id === project.clientId ? freelancer : client;
                const existingMyFeedback = state.feedbacks.find(
                  (f) => f.projectId === project.id && f.fromUserId === user.id
                );
                const receivedFeedback = state.feedbacks.find(
                  (f) => f.projectId === project.id && f.toUserId === user.id
                );
                const cert = state.certificates.find((c) => c.projectId === project.id);

                return `
                  <article class="glass-card workflow-card">
                    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                      <div>
                        <span class="badge badge-success">Completed</span>
                        <h3 style="margin:8px 0 4px;">${escapeHtml(project.title)}</h3>
                        <div class="text-xs text-muted">
                          ${escapeHtml(project.category)} · Budget ${App.formatCurrency(project.budget)} · Approved ${formatDate(project.submission?.approvedAt || project.createdAt)}
                        </div>
                      </div>
                      <span class="badge badge-silver">${escapeHtml(cert?.code || 'Ready')}</span>
                    </div>

                    <div class="text-sm">
                      <strong>Collaborator:</strong> ${escapeHtml(partner?.fullName || 'Platform Member')}
                      <span class="text-muted">(${escapeHtml(partner?.role || '')})</span>
                    </div>

                    ${
                      receivedFeedback
                        ? `
                      <div style="padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.65);border:1px solid rgba(100,165,255,0.3);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                          <strong class="text-sm">Feedback Received</strong>
                          <span style="color:#f59e0b;font-weight:700;">${'★'.repeat(receivedFeedback.rating)}${'☆'.repeat(5 - receivedFeedback.rating)}</span>
                        </div>
                        <p class="text-sm text-muted" style="margin:0;">"${escapeHtml(receivedFeedback.comment)}"</p>
                      </div>
                    `
                        : '<div class="text-xs text-muted">Awaiting partner feedback.</div>'
                    }

                    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;">
                      <button type="button" class="btn btn-primary btn-sm" data-open-cert="${project.id}">
                        Preview &amp; Print Certificate
                      </button>
                      ${
                        existingMyFeedback
                          ? `<span class="badge badge-blue">You rated ${existingMyFeedback.rating}/5 ★</span>`
                          : `<button type="button" class="btn btn-glass btn-sm" data-give-feedback="${project.id}" data-partner="${partner?.id || ''}">Leave Feedback</button>`
                      }
                    </div>
                  </article>
                `;
              })
              .join('')}</div>`
      }
    `;

    root.querySelectorAll('[data-open-cert]').forEach((btn) => {
      btn.addEventListener('click', () => openCertificateModal(btn.dataset.openCert));
    });

    root.querySelectorAll('[data-give-feedback]').forEach((btn) => {
      btn.addEventListener('click', () =>
        openFeedbackModal(user, btn.dataset.giveFeedback, btn.dataset.partner)
      );
    });
  }

  function openFeedbackModal(user, projectId, partnerId) {
    const state = loadState();
    const project = state.projects.find((p) => p.id === projectId);
    const partner = state.users.find((u) => u.id === partnerId);
    if (!project || !partner) return;

    let selectedRating = 5;
    openModal(
      `Leave Feedback — ${project.title}`,
      `
      <form id="feedbackForm" class="auth-form">
        <p class="text-sm text-muted" style="margin:0;">
          Sharing feedback for <strong>${escapeHtml(partner.fullName)}</strong>
        </p>
        <div class="form-group">
          <label class="form-label">Rating</label>
          <div class="star-rating" id="starPicker">
            ${[1, 2, 3, 4, 5]
              .map((n) => `<button type="button" class="star-btn active" data-star="${n}" aria-label="${n} stars">&#9733;</button>`)
              .join('')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="feedbackComment">Written Feedback</label>
          <textarea id="feedbackComment" class="form-control" placeholder="Describe communication, deliverable quality, and collaboration..." required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-glass" id="cancelFeedbackBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit Feedback</button>
        </div>
      </form>
      `,
      '520px'
    );

    const stars = document.querySelectorAll('#starPicker .star-btn');
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        selectedRating = Number(star.dataset.star);
        stars.forEach((s) => s.classList.toggle('active', Number(s.dataset.star) <= selectedRating));
      });
    });

    document.getElementById('cancelFeedbackBtn')?.addEventListener('click', closeModal);
    document.getElementById('feedbackForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const comment = document.getElementById('feedbackComment').value.trim();
      if (!comment) return;
      const freshState = loadState();
      freshState.feedbacks.push({
        id: 'fb_' + Date.now(),
        projectId,
        fromUserId: user.id,
        toUserId: partner.id,
        rating: selectedRating,
        comment,
        createdAt: new Date().toISOString()
      });
      saveState(freshState);
      App.addNotification(partner.id, {
        type: 'feedback',
        title: 'New Feedback Received',
        body: `${user.fullName} rated your collaboration ${selectedRating}/5 on "${project.title}".`,
        link: 'dashboard.html?view=certificates'
      });
      closeModal();
      showToast('Feedback saved!', 'success');
      renderCertificatesView(user);
    });
  }

  function openCertificateModal(projectId) {
    const state = loadState();
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return;
    const client = state.users.find((u) => u.id === project.clientId);
    const freelancer = state.users.find((u) => u.id === (project.selectedFreelancerIds || [])[0]);
    const cert = state.certificates.find((c) => c.projectId === project.id) || {
      issuedAt: project.submission?.approvedAt || new Date().toISOString(),
      code: 'PP-DEMO-' + project.id.toUpperCase()
    };

    openModal(
      'Experience Certificate Preview',
      `
      <div id="certificatePrintArea">
        <div class="certificate-sheet">
          <div class="certificate-inner-border">
            <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:14px;">
              <img src="assets/logo.png" alt="Pivot Pioneers logo" style="width:44px;height:44px;border-radius:10px;" />
              <div style="text-align:left;">
                <div style="font-weight:800;font-size:1.1rem;">PIVOT PIONEERS</div>
                <div class="text-xs text-muted">Project Collaboration Record (Demo Environment)</div>
              </div>
            </div>

            <div class="badge badge-blue" style="margin-bottom:12px;">Certificate of Project Completion</div>
            <p class="text-sm text-muted" style="margin:6px 0;">This record acknowledges that</p>
            <h2 style="margin:6px 0 8px;font-size:1.75rem;color:#0e2240;">${escapeHtml(freelancer?.fullName || 'Participant')}</h2>
            <p class="text-sm text-muted" style="max-width:520px;margin:0 auto 14px;line-height:1.6;">
              successfully collaborated on and completed the project
              <strong style="color:#0e2240;">"${escapeHtml(project.title)}"</strong>
              (${escapeHtml(project.category)}) for
              <strong style="color:#0e2240;">${escapeHtml(client?.fullName || 'Client')}</strong>
              ${client?.company ? `at ${escapeHtml(client.company)}` : ''}.
            </p>

            <div style="display:flex;justify-content:center;gap:28px;flex-wrap:wrap;margin:18px 0;padding:12px;border-top:1px solid rgba(47,111,237,0.2);border-bottom:1px solid rgba(47,111,237,0.2);">
              <div>
                <div class="text-xs text-muted">Skills Demonstrated</div>
                <div class="text-sm" style="font-weight:700;">${escapeHtml(project.skills.join(' · '))}</div>
              </div>
              <div>
                <div class="text-xs text-muted">Completion Date</div>
                <div class="text-sm" style="font-weight:700;">${formatDate(cert.issuedAt)}</div>
              </div>
              <div>
                <div class="text-xs text-muted">Record ID (Demo)</div>
                <div class="text-sm" style="font-weight:700;">${escapeHtml(cert.code)}</div>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:18px;font-size:0.8rem;color:#515e70;">
              <div>
                <div style="font-weight:700;color:#0e2240;">${escapeHtml(client?.fullName || 'Client Sponsor')}</div>
                <div>Project Owner</div>
              </div>
              <div>
                <div style="font-weight:700;color:#0e2240;">Pivot Pioneers</div>
                <div>Local Demo Record</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions no-print">
        <button type="button" class="btn btn-glass" id="closeCertModal">Close</button>
        <button type="button" class="btn btn-primary" id="printCertBtn">Print / Save PDF</button>
      </div>
      `,
      '780px'
    );

    document.getElementById('closeCertModal')?.addEventListener('click', closeModal);
    document.getElementById('printCertBtn')?.addEventListener('click', () => window.print());
  }

  function renderSettingsView(user) {
    const root = document.getElementById('dashboardContent');
    if (!root) return;

    const prefs = user.preferences || {
      emailNotifications: true,
      projectAlerts: true,
      messageAlerts: true,
      profileVisibility: 'platform'
    };

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Settings &amp; Preferences</h1>
          <p>Manage your account details, demo security settings, notifications, and profile privacy.</p>
        </div>
      </div>

      <div class="list-cards">
        <section class="glass-panel" style="padding:24px;">
          <h3 style="margin-top:0;">Edit Account Information</h3>
          <form id="accountSettingsForm" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="setFullName">Full Name</label>
              <input id="setFullName" class="form-control" value="${escapeHtml(user.fullName)}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="setEmail">Email Address</label>
              <input id="setEmail" type="email" class="form-control" value="${escapeHtml(user.email)}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="setSubRole">${user.role === 'freelancer' ? 'Talent Track' : 'Client Type'}</label>
              <input id="setSubRole" class="form-control" value="${escapeHtml(user.subRole || '')}" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Account Info</button>
            </div>
          </form>
        </section>

        <section class="glass-panel" style="padding:24px;">
          <h3 style="margin-top:0;">Change Password (Demo Interface)</h3>
          <p class="text-xs text-muted" style="margin-top:-6px;">
            Demo notice: Password updates are simulated locally and not stored as production credentials.
          </p>
          <form id="passwordSettingsForm" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="curPwd">Current Password</label>
              <input id="curPwd" type="password" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="newPwd">New Password</label>
              <input id="newPwd" type="password" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="confPwd">Confirm New Password</label>
              <input id="confPwd" type="password" class="form-control" required />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-glass">Update Demo Password</button>
            </div>
          </form>
        </section>

        <section class="glass-panel" style="padding:24px;">
          <h3 style="margin-top:0;">Notification &amp; Privacy Preferences</h3>
          <form id="prefsSettingsForm" class="auth-form">
            <label class="checkbox-label">
              <input type="checkbox" id="prefEmail" ${prefs.emailNotifications ? 'checked' : ''} />
              Email summaries for applications and approvals
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="prefProjects" ${prefs.projectAlerts ? 'checked' : ''} />
              New matching project alerts
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="prefMessages" ${prefs.messageAlerts ? 'checked' : ''} />
              Direct message notifications
            </label>
            <div class="form-group" style="margin-top:8px;">
              <label class="form-label" for="prefVisibility">Profile Visibility</label>
              <select id="prefVisibility" class="form-control">
                <option value="public" ${prefs.profileVisibility === 'public' ? 'selected' : ''}>Public (Visible in Search &amp; Previews)</option>
                <option value="platform" ${prefs.profileVisibility === 'platform' ? 'selected' : ''}>Pivot Pioneers Members Only</option>
                <option value="private" ${prefs.profileVisibility === 'private' ? 'selected' : ''}>Private (Active Collaborators Only)</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Preferences</button>
            </div>
          </form>
        </section>

        <section class="glass-panel" style="padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <h3 style="margin-top:0;">Account Type &amp; Session</h3>
            <p class="text-sm text-muted">
              Active Account Type: <strong style="color:#0e2240;text-transform:capitalize;">${escapeHtml(user.role)}</strong>
              (${escapeHtml(user.subRole || 'Demo')})
            </p>
            <p class="text-sm text-muted">
              Switch between separate Freelancer and Client demo sessions to explore both sides of the workflow, or reset demo data to factory defaults.
            </p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;">
            <button type="button" class="btn btn-glass" id="settingsSwitchRole">
              Switch to ${user.role === 'client' ? 'Demo Freelancer' : 'Demo Client'}
            </button>
            <button type="button" class="btn btn-glass" id="resetDemoDataBtn">Reset Demo Data</button>
            <button type="button" class="btn btn-danger" id="settingsLogoutBtn">Logout</button>
          </div>
        </section>
      </div>
    `;

    document.getElementById('accountSettingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const state = loadState();
      const target = state.users.find((u) => u.id === user.id);
      if (target) {
        target.fullName = document.getElementById('setFullName').value.trim();
        target.email = document.getElementById('setEmail').value.trim();
        target.subRole = document.getElementById('setSubRole').value.trim();
        saveState(state);
        App.setSession(target, true);
        showToast('Account information updated.', 'success');
        setTimeout(() => window.location.reload(), 500);
      }
    });

    document.getElementById('passwordSettingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const np = document.getElementById('newPwd').value;
      const cp = document.getElementById('confPwd').value;
      if (np !== cp) {
        showToast('New passwords do not match.', 'error');
        return;
      }
      e.target.reset();
      showToast('Demo password change simulated successfully.', 'success');
    });

    document.getElementById('prefsSettingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const state = loadState();
      const target = state.users.find((u) => u.id === user.id);
      if (target) {
        target.preferences = {
          emailNotifications: document.getElementById('prefEmail').checked,
          projectAlerts: document.getElementById('prefProjects').checked,
          messageAlerts: document.getElementById('prefMessages').checked,
          profileVisibility: document.getElementById('prefVisibility').value
        };
        saveState(state);
        showToast('Notification and privacy preferences saved.', 'success');
      }
    });

    document.getElementById('settingsSwitchRole')?.addEventListener('click', () => {
      App.switchDemoRole(user.role === 'client' ? 'freelancer' : 'client');
    });

    document.getElementById('resetDemoDataBtn')?.addEventListener('click', () => {
      localStorage.removeItem('pp_platform_state_v1');
      showToast('Demo data restored to defaults.', 'info');
      setTimeout(() => window.location.reload(), 500);
    });

    document.getElementById('settingsLogoutBtn')?.addEventListener('click', () => {
      App.clearSession();
      window.location.href = 'login.html';
    });
  }
})(window);
