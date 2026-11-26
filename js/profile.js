/* ==========================================================================
   Pivot Pioneers — LinkedIn-Style Profile, Completion Meter & Public Preview
   ========================================================================== */

(function (window) {
  'use strict';

  const App = window.PivotApp;
  const { loadState, saveState, escapeHtml, initials, showToast, openModal, closeModal } = App;

  let isPublicPreview = false;

  document.addEventListener('DOMContentLoaded', () => {
    const user = App.renderAppShell('profile');
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    const viewUserId = params.get('id') || user.id;
    renderProfilePage(user, viewUserId);
  });

  function calculateCompletion(profile) {
    const checks = [
      Boolean(profile.fullName),
      Boolean(profile.headline),
      Boolean(profile.about),
      Boolean(profile.education || profile.company),
      Boolean(profile.institution || profile.company),
      Boolean((profile.skills || []).length >= 2),
      Boolean((profile.experience || []).length >= 1),
      profile.role === 'freelancer'
        ? Boolean((profile.portfolioProjects || []).length >= 1)
        : Boolean(profile.company),
      profile.role === 'freelancer' ? Boolean(profile.resumeName) : true,
      Boolean(profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.website)
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }

  function renderProfilePage(currentUser, targetId) {
    const root = document.getElementById('profileContent');
    if (!root) return;

    const state = loadState();
    const profile = state.users.find((u) => u.id === targetId) || currentUser;
    const isOwn = profile.id === currentUser.id;
    const canEdit = isOwn && !isPublicPreview;
    const completion = calculateCompletion(profile);
    const isFreelancer = profile.role === 'freelancer';

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1>${isOwn ? 'My Profile' : escapeHtml(profile.fullName)}</h1>
          <p>${
            isOwn
              ? isPublicPreview
                ? 'Viewing how other Pivot Pioneers members see your profile.'
                : 'Manage your showcase, skills, resume, and portfolio.'
              : `${escapeHtml(profile.role.toUpperCase())} Profile`
          }</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          ${
            isOwn
              ? `
                <button type="button" class="btn btn-glass" id="togglePublicPreviewBtn">
                  ${isPublicPreview ? 'Exit Public Preview' : 'Public Profile Preview'}
                </button>
                ${!isPublicPreview ? `<button type="button" class="btn btn-primary" id="editCoreProfileBtn">Edit Profile</button>` : ''}
              `
              : `<button type="button" class="btn btn-primary" id="msgProfileUserBtn">Send Message</button>`
          }
        </div>
      </div>

      <div class="profile-layout">
        <div>
          <!-- Hero Card -->
          <section class="glass-panel" style="padding:0;margin-bottom:18px;overflow:hidden;">
            <div class="profile-banner"></div>
            <div class="profile-hero-body">
              <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;">
                <div class="avatar avatar-xl" style="border:4px solid #ffffff;">
                  ${
                    profile.photoDataUrl
                      ? `<img src="${escapeHtml(profile.photoDataUrl)}" alt="${escapeHtml(profile.fullName)}" />`
                      : escapeHtml(initials(profile.fullName))
                  }
                </div>
                ${
                  canEdit
                    ? `<label class="btn btn-glass btn-sm" style="cursor:pointer;">
                        Change Photo
                        <input type="file" id="profilePhotoInput" accept="image/*" style="display:none;" />
                      </label>`
                    : ''
                }
              </div>

              <div style="margin-top:14px;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                  <h2 style="margin:0;font-size:1.55rem;">${escapeHtml(profile.fullName)}</h2>
                  <span class="badge badge-blue">${escapeHtml(profile.role)} · ${escapeHtml(profile.subRole || 'Member')}</span>
                </div>
                <p style="margin:6px 0 8px;font-weight:500;color:#1a3763;">${escapeHtml(profile.headline || 'Add a professional headline')}</p>
                <div class="text-sm text-muted">
                  ${
                    isFreelancer
                      ? `${escapeHtml(profile.institution || 'University / College')} ${profile.education ? '· ' + escapeHtml(profile.education) : ''}`
                      : `${escapeHtml(profile.company || 'Organization')} ${profile.institution ? '· ' + escapeHtml(profile.institution) : ''}`
                  }
                </div>
              </div>
            </div>
          </section>

          <!-- About -->
          <section class="glass-panel profile-section">
            <h3 style="margin-top:0;">About</h3>
            <p class="text-muted" style="margin:0;line-height:1.65;">${escapeHtml(profile.about || 'Tell clients and collaborators about your focus areas and goals.')}</p>
          </section>

          <!-- Skills -->
          <section class="glass-panel profile-section">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <h3 style="margin:0;">Skills &amp; Capabilities</h3>
              ${canEdit ? `<button type="button" class="btn btn-glass btn-sm" id="addSkillBtn">+ Add Skill</button>` : ''}
            </div>
            <div class="skills-row" style="margin:0;">
              ${(profile.skills || []).map((s, idx) => `
                <span class="skill-tag">
                  ${escapeHtml(s)}
                  ${canEdit ? `<button type="button" data-remove-skill="${idx}" style="border:none;background:none;cursor:pointer;padding:0 2px;font-weight:700;" aria-label="Remove ${escapeHtml(s)}">&times;</button>` : ''}
                </span>
              `).join('') || '<span class="text-sm text-muted">No skills added yet.</span>'}
            </div>
          </section>

          <!-- Experience -->
          <section class="glass-panel profile-section">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <h3 style="margin:0;">Experience</h3>
              ${canEdit ? `<button type="button" class="btn btn-glass btn-sm" id="addExpBtn">+ Add Experience</button>` : ''}
            </div>
            ${
              (profile.experience || []).length
                ? profile.experience
                    .map(
                      (exp) => `
                    <div style="padding:12px 0;border-bottom:1px solid rgba(113,128,150,0.16);">
                      <strong>${escapeHtml(exp.title)}</strong>
                      <div class="text-xs text-muted">${escapeHtml(exp.organization)} · ${escapeHtml(exp.period)}</div>
                      <p class="text-sm text-muted" style="margin:6px 0 0;">${escapeHtml(exp.description)}</p>
                    </div>
                  `
                    )
                    .join('')
                : '<p class="text-sm text-muted" style="margin:0;">No experience entries listed yet.</p>'
            }
          </section>

          <!-- Portfolio Projects (Freelancer) or Sponsored Initiatives (Client) -->
          <section class="glass-panel profile-section">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <h3 style="margin:0;">${isFreelancer ? 'Portfolio Projects' : 'Featured Initiatives'}</h3>
              ${canEdit ? `<button type="button" class="btn btn-glass btn-sm" id="addPortfolioBtn">+ Add Project</button>` : ''}
            </div>
            ${
              (profile.portfolioProjects || []).length
                ? profile.portfolioProjects
                    .map(
                      (proj) => `
                    <div style="padding:12px 14px;border-radius:14px;background:rgba(255,255,255,0.62);border:1px solid rgba(100,165,255,0.28);margin-bottom:10px;">
                      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                        <strong>${escapeHtml(proj.title)}</strong>
                        ${proj.link ? `<a href="${escapeHtml(proj.link)}" target="_blank" rel="noopener" class="auth-link text-xs">Open Link &nearr;</a>` : ''}
                      </div>
                      <p class="text-sm text-muted" style="margin:6px 0 8px;">${escapeHtml(proj.description)}</p>
                      <div class="skills-row" style="margin:0;">
                        ${(proj.tags || []).map((t) => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('')}
                      </div>
                    </div>
                  `
                    )
                    .join('')
                : '<p class="text-sm text-muted" style="margin:0;">No portfolio projects added yet.</p>'
            }
          </section>
        </div>

        <!-- Right Sidebar Column -->
        <div>
          <section class="glass-panel profile-section">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <h3 style="margin:0;">Profile Completion</h3>
              <strong style="color:var(--mystic-blue);">${completion}%</strong>
            </div>
            <div class="completion-bar-track">
              <div class="completion-bar-fill" style="width:${completion}%;"></div>
            </div>
            <p class="text-xs text-muted" style="margin:6px 0 0;">
              ${completion === 100 ? 'Complete profile! Ready for top visibility.' : 'Add skills, resume, and portfolio links to reach 100%.'}
            </p>
          </section>

          ${
            isFreelancer
              ? `
            <section class="glass-panel profile-section">
              <h3 style="margin-top:0;">Resume &amp; CV</h3>
              <p class="text-sm text-muted" style="margin-bottom:12px;">
                ${profile.resumeName ? `Uploaded: <strong>${escapeHtml(profile.resumeName)}</strong>` : 'No resume uploaded yet.'}
              </p>
              ${
                canEdit
                  ? `<label class="btn btn-primary btn-sm" style="cursor:pointer;">
                      Upload Resume (PDF/DOC)
                      <input type="file" id="resumeUploadInput" accept=".pdf,.doc,.docx" style="display:none;" />
                    </label>`
                  : ''
              }
            </section>
          `
              : `
            <section class="glass-panel profile-section">
              <h3 style="margin-top:0;">Organization Details</h3>
              <div class="text-sm"><strong>Company:</strong> ${escapeHtml(profile.company || '—')}</div>
              <div class="text-sm" style="margin-top:6px;"><strong>Sponsor Type:</strong> ${escapeHtml(profile.subRole || 'Client')}</div>
            </section>
          `
          }

          <section class="glass-panel profile-section">
            <h3 style="margin-top:0;">Portfolio &amp; Social Links</h3>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${
                profile.socialLinks?.linkedin
                  ? `<a href="${escapeHtml(profile.socialLinks.linkedin)}" target="_blank" rel="noopener" class="btn btn-glass btn-sm">LinkedIn &nearr;</a>`
                  : ''
              }
              ${
                profile.socialLinks?.github
                  ? `<a href="${escapeHtml(profile.socialLinks.github)}" target="_blank" rel="noopener" class="btn btn-glass btn-sm">GitHub &nearr;</a>`
                  : ''
              }
              ${
                profile.socialLinks?.website
                  ? `<a href="${escapeHtml(profile.socialLinks.website)}" target="_blank" rel="noopener" class="btn btn-glass btn-sm">Website &nearr;</a>`
                  : ''
              }
              ${
                !profile.socialLinks?.linkedin && !profile.socialLinks?.github && !profile.socialLinks?.website
                  ? '<span class="text-sm text-muted">No social links added yet.</span>'
                  : ''
              }
            </div>
          </section>
        </div>
      </div>
    `;

    document.getElementById('togglePublicPreviewBtn')?.addEventListener('click', () => {
      isPublicPreview = !isPublicPreview;
      renderProfilePage(currentUser, targetId);
    });

    document.getElementById('msgProfileUserBtn')?.addEventListener('click', () => {
      const conv = App.ensureConversation('direct', currentUser.id, profile.id);
      window.location.href = `messages.html?conv=${conv.id}`;
    });

    if (!canEdit) return;

    document.getElementById('editCoreProfileBtn')?.addEventListener('click', () => openEditCoreModal(profile));

    document.getElementById('profilePhotoInput')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const fresh = loadState();
        const u = fresh.users.find((x) => x.id === profile.id);
        if (u) {
          u.photoDataUrl = reader.result;
          saveState(fresh);
          showToast('Profile photo updated!', 'success');
          renderProfilePage(u, u.id);
        }
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('resumeUploadInput')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const fresh = loadState();
      const u = fresh.users.find((x) => x.id === profile.id);
      if (u) {
        u.resumeName = file.name;
        saveState(fresh);
        showToast(`Resume "${file.name}" attached!`, 'success');
        renderProfilePage(u, u.id);
      }
    });

    document.getElementById('addSkillBtn')?.addEventListener('click', () => {
      openModal(
        'Add Skill',
        `
        <form id="addSkillForm" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="newSkillName">Skill Name</label>
            <input id="newSkillName" class="form-control" placeholder="e.g., TypeScript, Data Visualization" required />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-glass" id="cancelSkillBtn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Skill</button>
          </div>
        </form>
        `,
        '420px'
      );
      document.getElementById('cancelSkillBtn')?.addEventListener('click', closeModal);
      document.getElementById('addSkillForm')?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const val = document.getElementById('newSkillName').value.trim();
        if (!val) return;
        const fresh = loadState();
        const u = fresh.users.find((x) => x.id === profile.id);
        if (u && !u.skills.includes(val)) {
          u.skills.push(val);
          saveState(fresh);
        }
        closeModal();
        showToast('Skill added.', 'success');
        renderProfilePage(u, u.id);
      });
    });

    root.querySelectorAll('[data-remove-skill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.removeSkill);
        const fresh = loadState();
        const u = fresh.users.find((x) => x.id === profile.id);
        if (u) {
          u.skills.splice(idx, 1);
          saveState(fresh);
          renderProfilePage(u, u.id);
        }
      });
    });

    document.getElementById('addExpBtn')?.addEventListener('click', () => {
      openModal(
        'Add Experience',
        `
        <form id="addExpForm" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="expTitle">Role / Title</label>
            <input id="expTitle" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="expOrg">Organization</label>
            <input id="expOrg" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="expPeriod">Period</label>
            <input id="expPeriod" class="form-control" placeholder="e.g., May 2026 – Present" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="expDesc">Description</label>
            <textarea id="expDesc" class="form-control" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-glass" id="cancelExpBtn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Experience</button>
          </div>
        </form>
        `,
        '520px'
      );
      document.getElementById('cancelExpBtn')?.addEventListener('click', closeModal);
      document.getElementById('addExpForm')?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const fresh = loadState();
        const u = fresh.users.find((x) => x.id === profile.id);
        if (u) {
          u.experience.unshift({
            title: document.getElementById('expTitle').value.trim(),
            organization: document.getElementById('expOrg').value.trim(),
            period: document.getElementById('expPeriod').value.trim(),
            description: document.getElementById('expDesc').value.trim()
          });
          saveState(fresh);
        }
        closeModal();
        showToast('Experience added.', 'success');
        renderProfilePage(u, u.id);
      });
    });

    document.getElementById('addPortfolioBtn')?.addEventListener('click', () => {
      openModal(
        'Add Portfolio Project',
        `
        <form id="addPortForm" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="portTitle">Project Title</label>
            <input id="portTitle" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="portDesc">Description</label>
            <textarea id="portDesc" class="form-control" required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="portLink">Live / Repo Link</label>
            <input id="portLink" type="url" class="form-control" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label" for="portTags">Tags (comma-separated)</label>
            <input id="portTags" class="form-control" placeholder="React, UI/UX" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-glass" id="cancelPortBtn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Project</button>
          </div>
        </form>
        `,
        '520px'
      );
      document.getElementById('cancelPortBtn')?.addEventListener('click', closeModal);
      document.getElementById('addPortForm')?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const fresh = loadState();
        const u = fresh.users.find((x) => x.id === profile.id);
        if (u) {
          u.portfolioProjects.unshift({
            title: document.getElementById('portTitle').value.trim(),
            description: document.getElementById('portDesc').value.trim(),
            link: document.getElementById('portLink').value.trim(),
            tags: document
              .getElementById('portTags')
              .value.split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          });
          saveState(fresh);
        }
        closeModal();
        showToast('Portfolio project added.', 'success');
        renderProfilePage(u, u.id);
      });
    });
  }

  function openEditCoreModal(profile) {
    const isFreelancer = profile.role === 'freelancer';
    openModal(
      'Edit Profile Details',
      `
      <form id="editCoreForm" class="auth-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="edName">Full Name</label>
            <input id="edName" class="form-control" value="${escapeHtml(profile.fullName)}" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="edSubRole">${isFreelancer ? 'Talent Category' : 'Client Role'}</label>
            <input id="edSubRole" class="form-control" value="${escapeHtml(profile.subRole || '')}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="edHeadline">Professional Headline</label>
          <input id="edHeadline" class="form-control" value="${escapeHtml(profile.headline || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="edAbout">About Me</label>
          <textarea id="edAbout" class="form-control">${escapeHtml(profile.about || '')}</textarea>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="edEdu">Education / Degree</label>
            <input id="edEdu" class="form-control" value="${escapeHtml(profile.education || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="edInst">${isFreelancer ? 'College / University' : 'Company / Organization'}</label>
            <input id="edInst" class="form-control" value="${escapeHtml(isFreelancer ? profile.institution || '' : profile.company || '')}" />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="edLinkedin">LinkedIn URL</label>
            <input id="edLinkedin" type="url" class="form-control" value="${escapeHtml(profile.socialLinks?.linkedin || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="edGithub">GitHub / Portfolio URL</label>
            <input id="edGithub" type="url" class="form-control" value="${escapeHtml(profile.socialLinks?.github || profile.socialLinks?.website || '')}" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-glass" id="cancelCoreEdit">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
      `,
      '660px'
    );

    document.getElementById('cancelCoreEdit')?.addEventListener('click', closeModal);
    document.getElementById('editCoreForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fresh = loadState();
      const u = fresh.users.find((x) => x.id === profile.id);
      if (u) {
        u.fullName = document.getElementById('edName').value.trim();
        u.subRole = document.getElementById('edSubRole').value.trim();
        u.headline = document.getElementById('edHeadline').value.trim();
        u.about = document.getElementById('edAbout').value.trim();
        u.education = document.getElementById('edEdu').value.trim();
        if (isFreelancer) u.institution = document.getElementById('edInst').value.trim();
        else u.company = document.getElementById('edInst').value.trim();
        u.socialLinks = {
          ...(u.socialLinks || {}),
          linkedin: document.getElementById('edLinkedin').value.trim(),
          github: document.getElementById('edGithub').value.trim()
        };
        saveState(fresh);
        App.setSession(u, true);
        closeModal();
        showToast('Profile changes saved!', 'success');
        renderProfilePage(u, u.id);
      }
    });
  }
})(window);
