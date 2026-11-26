/* ==========================================================================
   Pivot Pioneers — Browse (3x2), Post Project, Applications, My Projects,
   Review Applicants & Full 12-Step Lifecycle
   ========================================================================== */

(function (window) {
  'use strict';

  const App = window.PivotApp;
  const {
    CATEGORIES,
    loadState,
    saveState,
    escapeHtml,
    initials,
    formatCurrency,
    formatDate,
    statusBadgeClass,
    openModal,
    closeModal,
    showToast
  } = App;

  let currentPage = 1;
  const PAGE_SIZE = 6;

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'browse';

    let navKey = 'browse';
    if (view === 'post') navKey = 'post';
    else if (view === 'applications') navKey = 'applications';
    else if (view === 'my-projects' || view === 'applicants') navKey = 'my-projects';

    const user = App.renderAppShell(navKey);
    if (!user) return;

    if (view === 'post') {
      renderPostProjectView(user, params.get('edit'));
    } else if (view === 'applications') {
      renderMyApplicationsView(user);
    } else if (view === 'my-projects') {
      renderMyProjectsView(user);
    } else if (view === 'applicants') {
      renderReviewApplicantsView(user, params.get('project'));
    } else {
      renderBrowseProjectsView(user, params);
    }
  });

  /* ------------------------------------------------------------------------
     1. BROWSE PROJECTS (3x2 Large Glass Card Grid, 6 per page)
     ------------------------------------------------------------------------ */
  function renderBrowseProjectsView(user, params) {
    const root = document.getElementById('projectsContent');
    if (!root) return;

    const state = loadState();
    const allSkills = Array.from(
      new Set(state.projects.flatMap((p) => p.skills || []))
    ).sort();

    const preCategory = params?.get('category') || 'All';
    const preProjectId = params?.get('project') || '';

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Browse Projects</h1>
          <p>Discover real student-friendly &amp; freelance collaborations across every discipline.</p>
        </div>
        ${
          user.role === 'client'
            ? '<a href="projects.html?view=post" class="btn btn-primary btn-floating">+ Post a Project</a>'
            : '<a href="projects.html?view=applications" class="btn btn-glass">View My Applications</a>'
        }
      </div>

      <section class="glass-panel filter-toolbar" aria-label="Project filters">
        <input type="search" id="filterSearch" class="form-control" placeholder="Search title, description, skills..." />
        <select id="filterCategory" class="form-control" aria-label="Filter by category">
          <option value="All">All Categories</option>
          ${CATEGORIES.map((c) => `<option value="${escapeHtml(c)}" ${preCategory === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
        </select>
        <select id="filterSkill" class="form-control" aria-label="Filter by skill">
          <option value="All">All Skills</option>
          ${allSkills.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}
        </select>
        <select id="filterBudget" class="form-control" aria-label="Filter by budget">
          <option value="All">Any Budget</option>
          <option value="under700">Under $700</option>
          <option value="700to1200">$700 – $1,200</option>
          <option value="over1200">$1,200+</option>
        </select>
        <select id="filterSort" class="form-control" aria-label="Sort projects">
          <option value="newest">Sort: Newest</option>
          <option value="budgetDesc">Budget: High to Low</option>
          <option value="budgetAsc">Budget: Low to High</option>
        </select>
      </section>

      <div id="browseGridMount"></div>
      <div id="browsePaginationMount" class="pagination-bar"></div>
    `;

    const applyFilters = () => {
      const freshState = loadState();
      const q = document.getElementById('filterSearch').value.trim().toLowerCase();
      const cat = document.getElementById('filterCategory').value;
      const skill = document.getElementById('filterSkill').value;
      const budget = document.getElementById('filterBudget').value;
      const sort = document.getElementById('filterSort').value;

      let list = freshState.projects.filter((p) => p.status === 'Open');
      if (q) {
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.skills.some((s) => s.toLowerCase().includes(q))
        );
      }
      if (cat !== 'All') list = list.filter((p) => p.category === cat);
      if (skill !== 'All') list = list.filter((p) => p.skills.includes(skill));
      if (budget === 'under700') list = list.filter((p) => p.budget < 700);
      else if (budget === '700to1200') list = list.filter((p) => p.budget >= 700 && p.budget <= 1200);
      else if (budget === 'over1200') list = list.filter((p) => p.budget > 1200);

      if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      else if (sort === 'budgetDesc') list.sort((a, b) => b.budget - a.budget);
      else if (sort === 'budgetAsc') list.sort((a, b) => a.budget - b.budget);

      const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = 1;
      const pageItems = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

      renderBrowseGrid(user, freshState, pageItems);
      renderPagination(totalPages, applyFilters);
    };

    ['filterSearch', 'filterCategory', 'filterSkill', 'filterBudget', 'filterSort'].forEach((id) => {
      document.getElementById(id)?.addEventListener(id === 'filterSearch' ? 'input' : 'change', () => {
        currentPage = 1;
        applyFilters();
      });
    });

    applyFilters();

    if (preProjectId) {
      openProjectDetailsModal(user, preProjectId, applyFilters);
    }
  }

  function renderBrowseGrid(user, state, items) {
    const mount = document.getElementById('browseGridMount');
    if (!mount) return;

    if (!items.length) {
      mount.innerHTML = `
        <div class="empty-state">
          <h3>No matching open projects found</h3>
          <p>Try clearing one of your category, skill, or budget filters.</p>
        </div>
      `;
      return;
    }

    mount.innerHTML = `
      <section class="projects-grid" aria-label="Projects list">
        ${items
          .map((p) => {
            const client = state.users.find((u) => u.id === p.clientId);
            const alreadyApplied = state.applications.some(
              (a) => a.projectId === p.id && a.freelancerId === user.id && a.status !== 'Withdrawn'
            );
            const isFreelancer = user.role === 'freelancer';
            return `
              <article class="glass-card project-card" data-project-card="${p.id}">
                <div>
                  <div class="project-card-head">
                    <span class="badge badge-blue">${escapeHtml(p.category)}</span>
                    <span class="badge badge-success">${escapeHtml(p.status)}</span>
                  </div>
                  <h3 class="project-card-title">${escapeHtml(p.title)}</h3>
                  <p class="project-card-desc">${escapeHtml(p.description)}</p>
                  <div class="skills-row">
                    ${p.skills.slice(0, 4).map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
                  </div>
                </div>

                <div>
                  <div class="project-meta-grid">
                    <div class="project-meta-item">
                      <span>Budget</span>
                      <strong>${formatCurrency(p.budget)}</strong>
                    </div>
                    <div class="project-meta-item">
                      <span>Est. Duration</span>
                      <strong>${escapeHtml(p.duration)}</strong>
                    </div>
                  </div>
                  <div class="project-card-footer">
                    <div class="client-chip">
                      <div class="avatar avatar-sm">${escapeHtml(initials(client?.fullName || 'Client'))}</div>
                      <span class="client-chip-name">${escapeHtml(client?.fullName || 'Client')}</span>
                    </div>
                    ${
                      isFreelancer
                        ? alreadyApplied
                          ? '<span class="badge badge-warning">Applied</span>'
                          : `<button type="button" class="btn btn-primary btn-sm" data-quick-apply="${p.id}">Apply Now</button>`
                        : '<span class="badge badge-silver">Client View</span>'
                    }
                  </div>
                </div>
              </article>
            `;
          })
          .join('')}
      </section>
    `;

    mount.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-quick-apply]')) {
          e.stopPropagation();
          openApplyFormModal(user, card.dataset.projectCard);
          return;
        }
        openProjectDetailsModal(user, card.dataset.projectCard);
      });
    });
  }

  function renderPagination(totalPages, onChange) {
    const mount = document.getElementById('browsePaginationMount');
    if (!mount) return;
    if (totalPages <= 1) {
      mount.innerHTML = '';
      return;
    }

    let html = `<button type="button" class="btn btn-glass btn-sm" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&larr; Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button type="button" class="btn ${i === currentPage ? 'btn-primary' : 'btn-glass'} btn-sm" data-page="${i}">${i}</button>`;
    }
    html += `<button type="button" class="btn btn-glass btn-sm" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next &rarr;</button>`;
    mount.innerHTML = html;

    mount.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentPage = Number(btn.dataset.page);
        onChange();
      });
    });
  }

  function openProjectDetailsModal(user, projectId) {
    const state = loadState();
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return;
    const client = state.users.find((u) => u.id === project.clientId);
    const existingApp = state.applications.find(
      (a) => a.projectId === project.id && a.freelancerId === user.id && a.status !== 'Withdrawn'
    );

    openModal(
      project.title,
      `
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
        <span class="badge badge-blue">${escapeHtml(project.category)}</span>
        <span class="badge ${statusBadgeClass(project.status)}">${escapeHtml(project.status)}</span>
        <span class="badge badge-silver">Posted ${formatDate(project.createdAt)}</span>
      </div>

      <p style="line-height:1.65;margin:0 0 16px;">${escapeHtml(project.description)}</p>

      <div class="project-meta-grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));">
        <div class="project-meta-item"><span>Budget</span><strong>${formatCurrency(project.budget)}</strong></div>
        <div class="project-meta-item"><span>Duration</span><strong>${escapeHtml(project.duration)}</strong></div>
        <div class="project-meta-item"><span>Deadline</span><strong>${formatDate(project.deadline)}</strong></div>
        <div class="project-meta-item"><span>Team Size</span><strong>${project.freelancersRequired || 1} Freelancer(s)</strong></div>
      </div>

      <div style="margin:14px 0;">
        <strong class="text-sm">Required Skills</strong>
        <div class="skills-row" style="margin-top:8px;">
          ${project.skills.map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>

      ${
        project.requirements
          ? `<div style="padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.65);border:1px solid rgba(100,165,255,0.3);margin-bottom:16px;">
              <strong class="text-sm">Additional Requirements</strong>
              <p class="text-sm text-muted" style="margin:4px 0 0;">${escapeHtml(project.requirements)}</p>
            </div>`
          : ''
      }

      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding-top:14px;border-top:1px solid rgba(113,128,150,0.2);">
        <a href="profile.html?id=${client?.id || ''}" class="client-chip">
          <div class="avatar avatar-sm">${escapeHtml(initials(client?.fullName || 'C'))}</div>
          <div>
            <div style="font-weight:700;font-size:0.88rem;">${escapeHtml(client?.fullName || 'Client')}</div>
            <div class="text-xs text-muted">${escapeHtml(client?.company || client?.headline || 'Client')}</div>
          </div>
        </a>
        <div style="display:flex;gap:10px;">
          <button type="button" class="btn btn-glass" id="modalCloseBtn">Close</button>
          ${
            user.role === 'freelancer'
              ? existingApp
                ? `<span class="badge badge-warning" style="align-self:center;">Application: ${escapeHtml(existingApp.status)}</span>`
                : project.status === 'Open'
                  ? `<button type="button" class="btn btn-primary" id="modalApplyBtn">Apply Now</button>`
                  : ''
              : `<span class="badge badge-silver" style="align-self:center;">Only Freelancers can apply</span>`
          }
        </div>
      </div>
      `,
      '720px'
    );

    document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
    document.getElementById('modalApplyBtn')?.addEventListener('click', () => {
      openApplyFormModal(user, project.id);
    });
  }

  function openApplyFormModal(user, projectId) {
    if (user.role !== 'freelancer') {
      showToast('Only Freelancer accounts can apply for projects.', 'error');
      return;
    }
    const state = loadState();
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return;
    const duplicate = state.applications.find(
      (a) => a.projectId === projectId && a.freelancerId === user.id && a.status !== 'Withdrawn'
    );
    if (duplicate) {
      showToast('You have already applied to this project.', 'info');
      return;
    }

    openModal(
      `Apply to ${project.title}`,
      `
      <form id="applyProjectForm" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="applyTimeline">Proposed Timeline</label>
          <input id="applyTimeline" class="form-control" value="${escapeHtml(project.duration)}" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="applyCoverNote">Why are you a great fit?</label>
          <textarea id="applyCoverNote" class="form-control" placeholder="Highlight relevant skills, student projects, or portfolio links..." required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-glass" id="cancelApplyBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit Application</button>
        </div>
      </form>
      `,
      '560px'
    );

    document.getElementById('cancelApplyBtn')?.addEventListener('click', closeModal);
    document.getElementById('applyProjectForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const freshState = loadState();
      const stillDup = freshState.applications.some(
        (a) => a.projectId === projectId && a.freelancerId === user.id && a.status !== 'Withdrawn'
      );
      if (stillDup) {
        showToast('Duplicate application blocked.', 'error');
        return;
      }

      const appRecord = {
        id: 'a_' + Date.now(),
        projectId,
        freelancerId: user.id,
        clientId: project.clientId,
        proposedTimeline: document.getElementById('applyTimeline').value.trim(),
        coverNote: document.getElementById('applyCoverNote').value.trim(),
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      freshState.applications.unshift(appRecord);
      saveState(freshState);

      App.addNotification(project.clientId, {
        type: 'application',
        title: 'New Application Received',
        body: `${user.fullName} applied to "${project.title}".`,
        link: `projects.html?view=applicants&project=${project.id}`
      });

      closeModal();
      showToast('Application submitted successfully!', 'success');
      renderBrowseProjectsView(user, new URLSearchParams(window.location.search));
    });
  }

  /* ------------------------------------------------------------------------
     2. POST A PROJECT (Client Only)
     ------------------------------------------------------------------------ */
  function renderPostProjectView(user, editProjectId) {
    const root = document.getElementById('projectsContent');
    if (!root) return;

    if (user.role !== 'client') {
      root.innerHTML = `
        <div class="empty-state">
          <h3>Client Account Required</h3>
          <p>Only Client accounts can publish projects. Switch to a Demo Client session to test project creation and applicant review.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <a href="projects.html?view=browse" class="btn btn-glass">Browse Projects</a>
            <button type="button" class="btn btn-primary" id="switchClientPost">Switch to Demo Client</button>
          </div>
        </div>
      `;
      document.getElementById('switchClientPost')?.addEventListener('click', () => App.switchDemoRole('client'));
      return;
    }

    const state = loadState();
    const editing = editProjectId
      ? state.projects.find((p) => p.id === editProjectId && p.clientId === user.id)
      : null;

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1>${editing ? 'Edit Project' : 'Post a Project'}</h1>
          <p>Define clear scope, budget, and skills to attract emerging student and freelance talent.</p>
        </div>
        <a href="projects.html?view=my-projects" class="btn btn-glass">Back to My Projects</a>
      </div>

      <section class="glass-panel form-panel">
        <form id="postProjectForm" class="auth-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="projTitle">Project Title</label>
              <input id="projTitle" class="form-control" placeholder="e.g., Campus Event Check-In Web App" value="${escapeHtml(editing?.title || '')}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="projCategory">Project Category</label>
              <select id="projCategory" class="form-control" required>
                ${CATEGORIES.map((c) => `<option value="${escapeHtml(c)}" ${editing?.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="projDesc">Project Description</label>
            <textarea id="projDesc" class="form-control" placeholder="Describe goals, expected deliverables, and collaboration expectations..." required>${escapeHtml(editing?.description || '')}</textarea>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="projSkills">Required Skills (comma-separated)</label>
              <input id="projSkills" class="form-control" placeholder="HTML5, CSS3, JavaScript, Figma" value="${escapeHtml((editing?.skills || []).join(', '))}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="projBudget">Budget (USD)</label>
              <input id="projBudget" type="number" min="50" step="10" class="form-control" placeholder="850" value="${editing?.budget || ''}" required />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="projDuration">Estimated Duration</label>
              <input id="projDuration" class="form-control" placeholder="e.g., 3 Weeks" value="${escapeHtml(editing?.duration || '')}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="projCount">Number of Freelancers Required</label>
              <input id="projCount" type="number" min="1" max="10" class="form-control" value="${editing?.freelancersRequired || 1}" required />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="projDeadline">Project Deadline</label>
              <input id="projDeadline" type="date" class="form-control" value="${escapeHtml(editing?.deadline || '2026-12-25')}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="projReqs">Additional Requirements</label>
              <input id="projReqs" class="form-control" placeholder="Weekly check-in, GitHub repository handover..." value="${escapeHtml(editing?.requirements || '')}" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-glass" id="saveDraftBtn">Save as Draft</button>
            <button type="button" class="btn btn-glass" id="previewProjBtn">Preview Project</button>
            <button type="submit" class="btn btn-primary">${editing ? 'Save & Publish' : 'Publish Project'}</button>
          </div>
        </form>
      </section>
    `;

    const collectFormData = (status) => {
      const title = document.getElementById('projTitle').value.trim();
      const category = document.getElementById('projCategory').value;
      const description = document.getElementById('projDesc').value.trim();
      const skills = document
        .getElementById('projSkills')
        .value.split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const budget = Number(document.getElementById('projBudget').value || 0);
      const duration = document.getElementById('projDuration').value.trim();
      const freelancersRequired = Number(document.getElementById('projCount').value || 1);
      const deadline = document.getElementById('projDeadline').value;
      const requirements = document.getElementById('projReqs').value.trim();

      if (!title || !description || !skills.length || !budget || !duration) {
        showToast('Please complete all required project fields.', 'error');
        return null;
      }

      return {
        title,
        category,
        description,
        skills,
        budget,
        duration,
        freelancersRequired,
        deadline,
        requirements,
        status
      };
    };

    const persistProject = (status) => {
      const payload = collectFormData(status);
      if (!payload) return;
      const freshState = loadState();
      if (editing) {
        const idx = freshState.projects.findIndex((p) => p.id === editing.id);
        if (idx !== -1) {
          freshState.projects[idx] = { ...freshState.projects[idx], ...payload };
        }
      } else {
        freshState.projects.unshift({
          id: 'p_' + Date.now(),
          ...payload,
          clientId: user.id,
          selectedFreelancerIds: [],
          submission: null,
          createdAt: new Date().toISOString()
        });
      }
      saveState(freshState);
      showToast(status === 'Draft' ? 'Project saved as draft.' : 'Project published to Browse Projects!', 'success');
      window.location.href = 'projects.html?view=my-projects';
    };

    document.getElementById('saveDraftBtn')?.addEventListener('click', () => persistProject('Draft'));

    document.getElementById('previewProjBtn')?.addEventListener('click', () => {
      const data = collectFormData('Preview');
      if (!data) return;
      openModal(
        `Preview: ${data.title}`,
        `
        <span class="badge badge-blue">${escapeHtml(data.category)}</span>
        <p style="line-height:1.6;">${escapeHtml(data.description)}</p>
        <div class="skills-row">${data.skills.map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}</div>
        <div class="project-meta-grid">
          <div class="project-meta-item"><span>Budget</span><strong>${formatCurrency(data.budget)}</strong></div>
          <div class="project-meta-item"><span>Duration</span><strong>${escapeHtml(data.duration)}</strong></div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-glass" id="closePreviewBtn">Back to Form</button>
        </div>
        `,
        '600px'
      );
      document.getElementById('closePreviewBtn')?.addEventListener('click', closeModal);
    });

    document.getElementById('postProjectForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      persistProject('Open');
    });
  }

  /* ------------------------------------------------------------------------
     3. MY APPLICATIONS (Freelancer Only)
     ------------------------------------------------------------------------ */
  function renderMyApplicationsView(user) {
    const root = document.getElementById('projectsContent');
    if (!root) return;

    if (user.role !== 'freelancer') {
      root.innerHTML = `
        <div class="empty-state">
          <h3>Freelancer Account Required</h3>
          <p>Client accounts review incoming applicants instead of submitting applications.</p>
          <a href="projects.html?view=applicants" class="btn btn-primary">Review Applicants</a>
        </div>
      `;
      return;
    }

    let statusFilter = 'All';
    const statuses = ['All', 'Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Withdrawn'];

    const renderList = () => {
      const state = loadState();
      let apps = state.applications.filter((a) => a.freelancerId === user.id);
      if (statusFilter !== 'All') apps = apps.filter((a) => a.status === statusFilter);

      root.innerHTML = `
        <div class="page-header">
          <div>
            <h1>My Applications</h1>
            <p>Track submitted proposals, review status updates, or withdraw pending applications.</p>
          </div>
          <a href="projects.html?view=browse" class="btn btn-primary">Browse More Projects</a>
        </div>

        <div class="tab-strip">
          ${statuses
            .map(
              (st) =>
                `<button type="button" class="tab-btn ${st === statusFilter ? 'active' : ''}" data-app-filter="${st}">${st}</button>`
            )
            .join('')}
        </div>

        ${
          apps.length === 0
            ? `<div class="empty-state"><h3>No Applications Found</h3><p>Explore open projects and submit your first proposal.</p><a href="projects.html?view=browse" class="btn btn-primary">Browse Projects</a></div>`
            : `<div class="list-cards">${apps
                .map((a) => {
                  const project = state.projects.find((p) => p.id === a.projectId);
                  const client = state.users.find((u) => u.id === a.clientId);
                  const canWithdraw = a.status === 'Pending' || a.status === 'Under Review';
                  return `
                    <article class="glass-card workflow-card">
                      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                        <div>
                          <span class="badge ${statusBadgeClass(a.status)}">${escapeHtml(a.status)}</span>
                          <h3 style="margin:8px 0 4px;">${escapeHtml(project?.title || 'Project')}</h3>
                          <div class="text-xs text-muted">
                            Client: <strong>${escapeHtml(client?.fullName || 'Client')}</strong> · Applied ${formatDate(a.createdAt)}
                          </div>
                        </div>
                        <div style="text-align:right;">
                          <div class="text-xs text-muted">Budget</div>
                          <strong>${formatCurrency(project?.budget || 0)}</strong>
                        </div>
                      </div>
                      <p class="text-sm text-muted" style="margin:0;">"${escapeHtml(a.coverNote)}"</p>
                      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;">
                        <button type="button" class="btn btn-glass btn-sm" data-view-proj="${a.projectId}">View Details</button>
                        <button type="button" class="btn btn-glass btn-sm" data-msg-client="${a.projectId}" data-client="${a.clientId}">Message Client</button>
                        ${
                          canWithdraw
                            ? `<button type="button" class="btn btn-danger btn-sm" data-withdraw="${a.id}">Withdraw</button>`
                            : ''
                        }
                      </div>
                    </article>
                  `;
                })
                .join('')}</div>`
        }
      `;

      root.querySelectorAll('[data-app-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
          statusFilter = btn.dataset.appFilter;
          renderList();
        });
      });

      root.querySelectorAll('[data-view-proj]').forEach((btn) => {
        btn.addEventListener('click', () => openProjectDetailsModal(user, btn.dataset.viewProj));
      });

      root.querySelectorAll('[data-msg-client]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const conv = App.ensureConversation(btn.dataset.msgClient, user.id, btn.dataset.client);
          window.location.href = `messages.html?conv=${conv.id}`;
        });
      });

      root.querySelectorAll('[data-withdraw]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const fresh = loadState();
          const target = fresh.applications.find((x) => x.id === btn.dataset.withdraw);
          if (target) {
            target.status = 'Withdrawn';
            saveState(fresh);
            showToast('Application withdrawn.', 'info');
            renderList();
          }
        });
      });
    };

    renderList();
  }

  /* ------------------------------------------------------------------------
     4. MY PROJECTS (Client & Freelancer Lifecycle Workspace)
     ------------------------------------------------------------------------ */
  function renderLifecycleSteps(status) {
    const stages = ['Open', 'In Progress', 'Submitted', 'Completed'];
    const currentIdx = stages.indexOf(status);
    return `
      <div class="workflow-steps" aria-label="Project lifecycle progress">
        ${stages
          .map((st, idx) => {
            let cls = '';
            if (status === 'Completed' || (currentIdx !== -1 && idx < currentIdx)) cls = 'done';
            else if (idx === currentIdx) cls = 'current';
            return `<span class="wf-step ${cls}">${escapeHtml(st)}</span>`;
          })
          .join('')}
      </div>
    `;
  }

  function renderMyProjectsView(user) {
    const root = document.getElementById('projectsContent');
    if (!root) return;

    const state = loadState();
    const isClient = user.role === 'client';

    const projects = isClient
      ? state.projects.filter((p) => p.clientId === user.id)
      : state.projects.filter((p) => (p.selectedFreelancerIds || []).includes(user.id));

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1>${isClient ? 'My Posted Projects' : 'My Active &amp; Completed Projects'}</h1>
          <p>${
            isClient
              ? 'Manage published projects, review applicants, and approve submitted deliverables.'
              : 'Track accepted engagements, submit completed work, and earn experience certificates.'
          }</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          ${
            isClient
              ? `<a href="projects.html?view=applicants" class="btn btn-glass">Review All Applicants</a>
                 <a href="projects.html?view=post" class="btn btn-primary">+ Post a Project</a>`
              : `<a href="projects.html?view=browse" class="btn btn-primary">Find More Projects</a>`
          }
        </div>
      </div>

      ${
        projects.length === 0
          ? `<div class="empty-state">
              <h3>${isClient ? 'No Projects Created Yet' : 'No Accepted Projects Yet'}</h3>
              <p>${
                isClient
                  ? 'Publish your first project to start receiving applications from students and freelancers.'
                  : 'Browse open projects and apply—once a client selects you, the project workspace appears here.'
              }</p>
              <a href="projects.html?view=${isClient ? 'post' : 'browse'}" class="btn btn-primary">${
                isClient ? 'Post a Project' : 'Browse Projects'
              }</a>
            </div>`
          : `<div class="list-cards">${projects
              .map((p) => {
                const applicants = state.applications.filter(
                  (a) => a.projectId === p.id && a.status !== 'Withdrawn'
                );
                const selectedUsers = (p.selectedFreelancerIds || [])
                  .map((fid) => state.users.find((u) => u.id === fid))
                  .filter(Boolean);
                const client = state.users.find((u) => u.id === p.clientId);

                return `
                  <article class="glass-card workflow-card">
                    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                      <div>
                        <span class="badge ${statusBadgeClass(p.status)}">${escapeHtml(p.status)}</span>
                        <h3 style="margin:8px 0 4px;">${escapeHtml(p.title)}</h3>
                        <div class="text-xs text-muted">
                          ${escapeHtml(p.category)} · Budget ${formatCurrency(p.budget)} · Due ${formatDate(p.deadline)}
                        </div>
                      </div>
                      ${
                        isClient
                          ? `<span class="badge badge-blue">${applicants.length} Applicant(s)</span>`
                          : `<span class="badge badge-silver">Client: ${escapeHtml(client?.fullName || '')}</span>`
                      }
                    </div>

                    ${renderLifecycleSteps(p.status)}

                    ${
                      selectedUsers.length
                        ? `<div class="text-sm"><strong>Selected Talent:</strong> ${selectedUsers.map((u) => escapeHtml(u.fullName)).join(', ')}</div>`
                        : ''
                    }

                    ${
                      p.submission
                        ? `<div style="padding:10px 12px;border-radius:12px;background:rgba(255,255,255,0.65);border:1px solid rgba(100,165,255,0.3);">
                            <strong class="text-xs">Submitted Deliverable:</strong>
                            <div class="text-sm" style="margin-top:3px;">${escapeHtml(p.submission.summary)}</div>
                            ${
                              p.submission.deliverableUrl
                                ? `<div class="text-xs text-muted" style="margin-top:4px;">Link: ${escapeHtml(p.submission.deliverableUrl)}</div>`
                                : ''
                            }
                          </div>`
                        : ''
                    }

                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;">
                      ${
                        isClient
                          ? `
                            <a href="projects.html?view=applicants&project=${p.id}" class="btn btn-glass btn-sm">View Applicants (${applicants.length})</a>
                            <a href="projects.html?view=post&edit=${p.id}" class="btn btn-glass btn-sm">Edit</a>
                            ${p.status === 'Draft' ? `<button type="button" class="btn btn-primary btn-sm" data-proj-action="publish" data-id="${p.id}">Publish</button>` : ''}
                            ${p.status === 'Open' ? `<button type="button" class="btn btn-danger btn-sm" data-proj-action="close" data-id="${p.id}">Close</button>` : ''}
                            ${p.status === 'Closed' ? `<button type="button" class="btn btn-success btn-sm" data-proj-action="reopen" data-id="${p.id}">Reopen</button>` : ''}
                            ${p.status === 'Submitted' ? `<button type="button" class="btn btn-success btn-sm" data-proj-action="approve" data-id="${p.id}">Approve Work &amp; Complete</button>` : ''}
                            ${p.status === 'Completed' ? `<a href="dashboard.html?view=certificates" class="btn btn-primary btn-sm">Feedback &amp; Certificate</a>` : ''}
                          `
                          : `
                            <button type="button" class="btn btn-glass btn-sm" data-msg-partner="${p.id}" data-partner="${p.clientId}">Message Client</button>
                            ${p.status === 'In Progress' ? `<button type="button" class="btn btn-primary btn-sm" data-submit-work="${p.id}">Submit Completed Work</button>` : ''}
                            ${p.status === 'Submitted' ? `<span class="badge badge-blue">Awaiting Client Approval</span>` : ''}
                            ${p.status === 'Completed' ? `<a href="dashboard.html?view=certificates" class="btn btn-success btn-sm">Feedback &amp; Certificate</a>` : ''}
                          `
                      }
                    </div>
                  </article>
                `;
              })
              .join('')}</div>`
      }
    `;

    root.querySelectorAll('[data-proj-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.projAction;
        const pid = btn.dataset.id;
        const fresh = loadState();
        const proj = fresh.projects.find((x) => x.id === pid);
        if (!proj) return;

        if (action === 'publish' || action === 'reopen') proj.status = 'Open';
        else if (action === 'close') proj.status = 'Closed';
        else if (action === 'approve') {
          proj.status = 'Completed';
          if (proj.submission) proj.submission.approvedAt = new Date().toISOString();
          const fid = (proj.selectedFreelancerIds || [])[0];
          if (fid) {
            fresh.certificates.push({
              id: 'cert_' + Date.now(),
              projectId: proj.id,
              freelancerId: fid,
              clientId: user.id,
              issuedAt: new Date().toISOString().slice(0, 10),
              code: 'PP-DEMO-' + Math.floor(1000 + Math.random() * 9000)
            });
            saveState(fresh);
            App.addNotification(fid, {
              type: 'approval',
              title: 'Work Approved & Certificate Ready',
              body: `${user.fullName} approved "${proj.title}". Your Experience Certificate is ready!`,
              link: 'dashboard.html?view=certificates'
            });
            showToast('Project marked Completed! Experience Certificate generated.', 'success');
            renderMyProjectsView(user);
            return;
          }
        }
        saveState(fresh);
        showToast(`Project updated to ${proj.status}.`, 'success');
        renderMyProjectsView(user);
      });
    });

    root.querySelectorAll('[data-submit-work]').forEach((btn) => {
      btn.addEventListener('click', () => openSubmitWorkModal(user, btn.dataset.submitWork));
    });

    root.querySelectorAll('[data-msg-partner]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const conv = App.ensureConversation(btn.dataset.msgPartner, user.id, btn.dataset.partner);
        window.location.href = `messages.html?conv=${conv.id}`;
      });
    });
  }

  function openSubmitWorkModal(user, projectId) {
    const state = loadState();
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return;

    openModal(
      `Submit Completed Work — ${project.title}`,
      `
      <form id="submitWorkForm" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="workSummary">Deliverable Summary</label>
          <textarea id="workSummary" class="form-control" placeholder="Summarize what you built, tested, and packaged for review..." required></textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="workLink">Deliverable / Repository / Demo Link</label>
          <input id="workLink" type="url" class="form-control" placeholder="https://github.com/..." required />
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-glass" id="cancelSubmitWork">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit Work for Review</button>
        </div>
      </form>
      `,
      '560px'
    );

    document.getElementById('cancelSubmitWork')?.addEventListener('click', closeModal);
    document.getElementById('submitWorkForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fresh = loadState();
      const target = fresh.projects.find((p) => p.id === projectId);
      if (target) {
        target.status = 'Submitted';
        target.submission = {
          summary: document.getElementById('workSummary').value.trim(),
          deliverableUrl: document.getElementById('workLink').value.trim(),
          submittedAt: new Date().toISOString(),
          approvedAt: null
        };
        saveState(fresh);
        App.addNotification(target.clientId, {
          type: 'update',
          title: 'Work Submitted for Review',
          body: `${user.fullName} submitted deliverables for "${target.title}".`,
          link: 'projects.html?view=my-projects'
        });
      }
      closeModal();
      showToast('Deliverable submitted! Client notified for approval.', 'success');
      renderMyProjectsView(user);
    });
  }

  /* ------------------------------------------------------------------------
     5. REVIEW APPLICANTS (Client Only)
     ------------------------------------------------------------------------ */
  function renderReviewApplicantsView(user, preProjectId) {
    const root = document.getElementById('projectsContent');
    if (!root) return;

    if (user.role !== 'client') {
      root.innerHTML = `
        <div class="empty-state">
          <h3>Client Account Required</h3>
          <p>Only Client accounts can review and select applicants.</p>
          <button type="button" class="btn btn-primary" id="switchClientApps">Switch to Demo Client</button>
        </div>
      `;
      document.getElementById('switchClientApps')?.addEventListener('click', () => App.switchDemoRole('client'));
      return;
    }

    let selectedProjectFilter = preProjectId || 'All';

    const renderApplicants = () => {
      const state = loadState();
      const myProjects = state.projects.filter((p) => p.clientId === user.id);
      let apps = state.applications.filter(
        (a) => a.clientId === user.id && a.status !== 'Withdrawn'
      );
      if (selectedProjectFilter !== 'All') {
        apps = apps.filter((a) => a.projectId === selectedProjectFilter);
      }

      root.innerHTML = `
        <div class="page-header">
          <div>
            <h1>Review Applicants</h1>
            <p>Evaluate student &amp; freelancer portfolios, shortlist candidates, and select project members.</p>
          </div>
          <a href="projects.html?view=my-projects" class="btn btn-glass">My Posted Projects</a>
        </div>

        <div class="glass-panel" style="padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <label class="form-label" for="applicantProjectFilter" style="margin:0;">Filter by Project:</label>
          <select id="applicantProjectFilter" class="form-control" style="max-width:340px;">
            <option value="All">All My Projects (${apps.length})</option>
            ${myProjects
              .map(
                (p) =>
                  `<option value="${p.id}" ${selectedProjectFilter === p.id ? 'selected' : ''}>${escapeHtml(p.title)}</option>`
              )
              .join('')}
          </select>
        </div>

        ${
          apps.length === 0
            ? `<div class="empty-state"><h3>No Applicants Yet</h3><p>Applications submitted to your open projects will appear here for review.</p></div>`
            : `<div class="list-cards">${apps
                .map((app) => {
                  const freelancer = state.users.find((u) => u.id === app.freelancerId);
                  const project = state.projects.find((p) => p.id === app.projectId);
                  const latestExp = (freelancer?.experience || [])[0];
                  const firstPortfolio = (freelancer?.portfolioProjects || [])[0];

                  return `
                    <article class="glass-card workflow-card">
                      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                        <div class="client-chip">
                          <div class="avatar">${escapeHtml(initials(freelancer?.fullName || 'F'))}</div>
                          <div>
                            <h3 style="margin:0;font-size:1.05rem;">${escapeHtml(freelancer?.fullName || 'Freelancer')}</h3>
                            <div class="text-xs text-muted">${escapeHtml(freelancer?.headline || '')}</div>
                          </div>
                        </div>
                        <span class="badge ${statusBadgeClass(app.status)}">${escapeHtml(app.status)}</span>
                      </div>

                      <div class="text-xs text-muted">
                        Applied for <strong>${escapeHtml(project?.title || 'Project')}</strong> · ${formatDate(app.createdAt)}
                      </div>

                      <div class="skills-row" style="margin:0;">
                        ${(freelancer?.skills || []).slice(0, 5).map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
                      </div>

                      <div style="font-size:0.84rem;display:grid;gap:4px;">
                        <div><strong>Education:</strong> ${escapeHtml(freelancer?.education || '—')} ${freelancer?.institution ? `(${escapeHtml(freelancer.institution)})` : ''}</div>
                        <div><strong>Experience:</strong> ${latestExp ? `${escapeHtml(latestExp.title)} @ ${escapeHtml(latestExp.organization)}` : 'Student / Emerging Talent'}</div>
                        <div><strong>Portfolio:</strong> ${firstPortfolio ? escapeHtml(firstPortfolio.title) : 'View profile'} · <strong>Resume:</strong> ${escapeHtml(freelancer?.resumeName || 'Not attached')}</div>
                      </div>

                      <p class="text-sm text-muted" style="margin:0;">"${escapeHtml(app.coverNote)}"</p>

                      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;">
                        <a href="profile.html?id=${freelancer?.id || ''}" class="btn btn-glass btn-sm">View Profile</a>
                        <button type="button" class="btn btn-glass btn-sm" data-msg-applicant="${app.projectId}" data-uid="${app.freelancerId}">Send Message</button>
                        ${app.status !== 'Shortlisted' && app.status !== 'Accepted' ? `<button type="button" class="btn btn-glass btn-sm" data-app-status="Shortlisted" data-aid="${app.id}">Shortlist</button>` : ''}
                        ${app.status !== 'Accepted' ? `<button type="button" class="btn btn-success btn-sm" data-app-status="Accepted" data-aid="${app.id}">Accept</button>` : ''}
                        ${app.status !== 'Rejected' && app.status !== 'Accepted' ? `<button type="button" class="btn btn-danger btn-sm" data-app-status="Rejected" data-aid="${app.id}">Reject</button>` : ''}
                      </div>
                    </article>
                  `;
                })
                .join('')}</div>`
        }
      `;

      document.getElementById('applicantProjectFilter')?.addEventListener('change', (e) => {
        selectedProjectFilter = e.target.value;
        renderApplicants();
      });

      root.querySelectorAll('[data-msg-applicant]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const conv = App.ensureConversation(btn.dataset.msgApplicant, user.id, btn.dataset.uid);
          window.location.href = `messages.html?conv=${conv.id}`;
        });
      });

      root.querySelectorAll('[data-app-status]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const newStatus = btn.dataset.appStatus;
          const aid = btn.dataset.aid;
          const fresh = loadState();
          const app = fresh.applications.find((x) => x.id === aid);
          if (!app) return;

          app.status = newStatus;
          const proj = fresh.projects.find((p) => p.id === app.projectId);

          if (newStatus === 'Accepted' && proj) {
            if (!proj.selectedFreelancerIds) proj.selectedFreelancerIds = [];
            if (!proj.selectedFreelancerIds.includes(app.freelancerId)) {
              proj.selectedFreelancerIds.push(app.freelancerId);
            }
            if (proj.status === 'Open') proj.status = 'In Progress';
            saveState(fresh);
            App.ensureConversation(proj.id, user.id, app.freelancerId);
            App.addNotification(app.freelancerId, {
              type: 'application',
              title: 'Application Accepted!',
              body: `${user.fullName} accepted your proposal for "${proj.title}". Project is now In Progress.`,
              link: 'projects.html?view=my-projects'
            });
            showToast('Applicant accepted and added to project team!', 'success');
          } else {
            saveState(fresh);
            App.addNotification(app.freelancerId, {
              type: 'application',
              title: `Application ${newStatus}`,
              body: `Your application for "${proj?.title || 'Project'}" was marked ${newStatus}.`,
              link: 'projects.html?view=applications'
            });
            showToast(`Applicant marked ${newStatus}.`, 'info');
          }
          renderApplicants();
        });
      });
    };

    renderApplicants();
  }
})(window);
