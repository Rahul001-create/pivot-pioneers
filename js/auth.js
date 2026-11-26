/* ==========================================================================
   Pivot Pioneers — Login, Signup & Account Type Card Selection
   ========================================================================== */

(function (window) {
  'use strict';

  const { loadState, saveState, setSession, openModal, closeModal, showToast } = window.PivotApp;

  document.addEventListener('DOMContentLoaded', () => {
    initRoleCards();
    initPasswordToggles();
    initLoginForm();
    initSignupForm();
    initDemoQuickActions();
    initForgotPassword();
  });

  function initRoleCards() {
    const cards = document.querySelectorAll('.role-card[data-role]');
    const hiddenInput = document.getElementById('selectedRole');
    if (!cards.length || !hiddenInput) return;

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        hiddenInput.value = card.dataset.role;
      });
    });
  }

  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        const showing = input.type === 'text';
        input.type = showing ? 'password' : 'text';
        btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
        btn.innerHTML = showing
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      });
    });
  }

  function showAuthError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
  }

  function clearAuthError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.remove('visible');
  }

  function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const errorEl = document.getElementById('authError');
    const identifierInput = document.getElementById('loginIdentifier');
    const passwordInput = document.getElementById('loginPassword');
    const roleInput = document.getElementById('selectedRole');
    const rememberInput = document.getElementById('rememberMe');

    // Pre-fill remembered identifier if present
    const remembered = localStorage.getItem('pp_remember_identifier');
    if (remembered && identifierInput) {
      identifierInput.value = remembered;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAuthError(errorEl);

      const identifier = (identifierInput?.value || '').trim();
      const password = passwordInput?.value || '';
      const role = roleInput?.value || '';
      const remember = Boolean(rememberInput?.checked);

      if (!role) {
        return showAuthError(errorEl, 'Please select an account type (Freelancer or Client) before logging in.');
      }
      if (!identifier) {
        return showAuthError(errorEl, 'Please enter your email or username.');
      }
      if (!password) {
        return showAuthError(errorEl, 'Please enter your password.');
      }

      const state = loadState();
      const lower = identifier.toLowerCase();

      // Match existing demo/custom user for selected role, or create demo session profile
      let user = state.users.find(
        (u) =>
          u.role === role &&
          (u.email.toLowerCase() === lower || u.fullName.toLowerCase() === lower)
      );

      if (!user) {
        // Demo mode: allow any non-empty email/username and password
        const cleanName = identifier.includes('@')
          ? identifier
              .split('@')[0]
              .replace(/[._-]+/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase())
          : identifier;

        user = {
          id: 'u_custom_' + Date.now(),
          role,
          subRole: role === 'freelancer' ? 'Student' : 'Project Owner',
          fullName: cleanName,
          email: identifier.includes('@') ? identifier : `${identifier.toLowerCase().replace(/\s+/g, '.')}@demo.pivotpioneers.local`,
          headline:
            role === 'freelancer'
              ? 'Emerging Talent & Student Freelancer on Pivot Pioneers'
              : 'Project Owner & Collaborator on Pivot Pioneers',
          about: 'Demo account created during local testing.',
          education: role === 'freelancer' ? 'Undergraduate Studies' : '',
          institution: role === 'freelancer' ? 'Partner University' : '',
          company: role === 'client' ? `${cleanName} Ventures` : '',
          skills: role === 'freelancer' ? ['JavaScript', 'UI/UX Design', 'Research'] : ['Project Management'],
          experience: [],
          portfolioProjects: [],
          resumeName: '',
          portfolioLinks: [],
          socialLinks: { github: '', linkedin: '', website: '' },
          preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
          isDemo: true
        };
        state.users.push(user);
        saveState(state);
      }

      if (remember) {
        localStorage.setItem('pp_remember_identifier', identifier);
      } else {
        localStorage.removeItem('pp_remember_identifier');
      }

      setSession(user, remember);
      window.location.href = 'dashboard.html';
    });
  }

  function initSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    const errorEl = document.getElementById('authError');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAuthError(errorEl);

      const fullName = (document.getElementById('signupName')?.value || '').trim();
      const email = (document.getElementById('signupEmail')?.value || '').trim();
      const password = document.getElementById('signupPassword')?.value || '';
      const confirm = document.getElementById('signupConfirmPassword')?.value || '';
      const role = document.getElementById('selectedRole')?.value || '';
      const termsChecked = Boolean(document.getElementById('signupTerms')?.checked);

      if (!role) {
        return showAuthError(errorEl, 'Please choose Freelancer or Client account type.');
      }
      if (!fullName) {
        return showAuthError(errorEl, 'Please enter your full name.');
      }
      if (!email || !email.includes('@')) {
        return showAuthError(errorEl, 'Please enter a valid email address.');
      }
      if (!password || password.length < 4) {
        return showAuthError(errorEl, 'Please enter a password (at least 4 characters for demo mode).');
      }
      if (password !== confirm) {
        return showAuthError(errorEl, 'Passwords do not match.');
      }
      if (!termsChecked) {
        return showAuthError(errorEl, 'Please accept the Terms and Conditions to create your account.');
      }

      const state = loadState();
      const newUser = {
        id: 'u_new_' + Date.now(),
        role,
        subRole: role === 'freelancer' ? 'Student' : 'Project Owner',
        fullName,
        email,
        headline:
          role === 'freelancer'
            ? 'Student & Emerging Freelancer'
            : 'Client & Project Collaborator',
        about: 'New Pivot Pioneers demo member ready to collaborate.',
        education: '',
        institution: '',
        company: role === 'client' ? `${fullName} Studio` : '',
        skills: role === 'freelancer' ? ['Web Development', 'Communication'] : ['Product Strategy'],
        experience: [],
        portfolioProjects: [],
        resumeName: '',
        portfolioLinks: [],
        socialLinks: { github: '', linkedin: '', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
        isDemo: true
      };

      state.users.push(newUser);
      saveState(state);
      setSession(newUser, true);
      window.location.href = 'dashboard.html';
    });
  }

  function initDemoQuickActions() {
    document.querySelectorAll('[data-demo-login]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.demoLogin;
        const state = loadState();
        const demoUser = state.users.find((u) => u.role === role);
        if (demoUser) {
          setSession(demoUser, true);
          window.location.href = 'dashboard.html';
        }
      });
    });
  }

  function initForgotPassword() {
    const trigger = document.getElementById('forgotPasswordBtn');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      openModal(
        'Reset Password (Demo Mode)',
        `
        <p class="text-muted text-sm" style="margin-top:0;">
          In local demo mode, email delivery is simulated. Enter your email to receive a demo reset confirmation and continue testing immediately.
        </p>
        <form id="forgotForm" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="forgotEmail">Account Email</label>
            <input type="email" id="forgotEmail" class="form-control" placeholder="you@university.edu" required />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-glass" id="cancelForgot">Cancel</button>
            <button type="submit" class="btn btn-primary">Send Demo Reset Link</button>
          </div>
        </form>
      `,
        '480px'
      );
      document.getElementById('cancelForgot')?.addEventListener('click', closeModal);
      document.getElementById('forgotForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        showToast('Demo reset link simulated. You may sign in with any non-empty password.', 'success');
      });
    });
  }
})(window);
