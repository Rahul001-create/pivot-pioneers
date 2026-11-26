# Pivot Pioneers

**Pivot Pioneers** is a modern, responsive, full-stack-ready freelancing and student collaboration web application built with a **Mystic Blue & Obscure Grey Light Glassmorphism** design system.

It connects **students, emerging talent, and independent freelancers** with **clients, recruiters, and business owners** through a complete end-to-end project lifecycle: discovery, applications, applicant review, hiring, project execution, work submission, client approval, feedback, and printable experience certificates.

---

## Key Features

- **Role-Based Authentication (Demo Mode)**:
  - Login & Signup with selectable **Freelancer** and **Client** glass cards (no dropdowns).
  - Show/hide password toggle, Remember Me, Forgot Password flow, form validation, and separate persistent `localStorage` demo sessions.
  - Clear disclaimer that `localStorage` is for local demo testing only and not production authentication.
- **Overview Dashboard (3 × 2 Glass Grid)**:
  - Six prominent glass cards fitting cleanly on desktop without clutter: **Browse Projects**, **Post a Project**, **My Applications**, **My Profile**, **Review Applicants**, and **Feedback & Certificates**.
- **Browse Projects (3 × 2 Card Grid)**:
  - 6 rich project cards per page with search, category filters, skill filters, budget filters, sorting (newest / budget), pagination, detailed modal view, duplicate-application prevention, and Freelancer-only Apply workflow.
- **Complete Project Lifecycle**:
  1. Client publishes (or saves draft / previews) a project.
  2. Freelancer discovers and applies.
  3. Client reviews applicants (Shortlist, Accept, Reject, Message, View Profile).
  4. Accepted freelancer starts project and submits completed work.
  5. Client reviews and approves completed work.
  6. Project completes; both parties leave ratings & written feedback.
  7. Printable Experience Certificate becomes available.
- **Internal Messaging**:
  - Contextual conversations linked to projects/applications, search, unread badges, timestamps, and a Socket.IO-ready event adapter pattern.
- **LinkedIn-Inspired Profile**:
  - Editable profile with completion meter, public preview toggle, skills manager, portfolio projects, resume upload (metadata/preview stored locally), education, experience, and social links—tailored by role.
- **Global Search, Notifications & Settings**:
  - Live header search across projects, freelancers, clients, skills, and categories.
  - Notification drawer with read/unread state for applications, messages, approvals, and feedback.
  - Settings page with account editing, demo password update, notification preferences, and privacy controls.

---

## Project Structure

```text
pivot-pioneers/
├── frontend/
│   ├── index.html          # Brand entry & quick launch portal
│   ├── login.html          # Authentication (Login)
│   ├── signup.html         # Registration (Signup)
│   ├── dashboard.html      # Overview (3x2 grid), Feedback & Certificates, Settings
│   ├── projects.html       # Browse Projects (3x2), Post Project, My Applications, My Projects, Review Applicants
│   ├── profile.html        # LinkedIn-style Profile + Public View
│   ├── messages.html       # Internal Messaging Workspace
│   ├── css/
│   │   ├── style.css       # Core Mystic Blue glassmorphism design tokens & shared UI
│   │   ├── auth.css        # Login/Signup glass cards & ambient canvas/video styling
│   │   ├── dashboard.css   # App shell, sidebar, topbar, 3x2 grids, modals, certificates
│   │   └── responsive.css  # Tablet & mobile breakpoints + print styles for certificates
│   ├── js/
│   │   ├── app.js          # Demo store, seed data, role permissions, search, notifications, shell
│   │   ├── auth.js         # Login, Signup, card selection, demo quick-login
│   │   ├── dashboard.js    # Overview 3x2 grid, Feedback & Certificates, Settings
│   │   ├── projects.js     # Browse, Post, Applications, My Projects lifecycle, Review Applicants
│   │   ├── profile.js      # Profile editor, completion meter, public preview, user viewer
│   │   └── messages.js     # Conversation list, chat thread, Socket.IO-ready emitter
│   └── assets/
│       ├── logo.png        # Pivot Pioneers logo
│       ├── images/
│       └── videos/         # Optional background video slot (auth pages gracefully fall back to Mystic Blue ambient canvas)
├── backend/
│   ├── server.js           # Express server + REST API mounting + Socket.IO integration hook
│   ├── config/db.js        # MongoDB connection config (disabled by default for local demo)
│   ├── middleware/auth.js  # Auth & role-guard middleware scaffold
│   ├── models/             # Mongoose schemas (User, Project, Application, Message, Review)
│   ├── controllers/        # Route controllers
│   └── routes/             # REST API route definitions
├── package.json
└── README.md
```

---

## Running Locally

### Option 1: Frontend Only (Zero Dependencies)
Serve the `frontend/` directory with any static HTTP server (or open `frontend/index.html` / `frontend/login.html` directly in a browser):

```bash
python -m http.server 8080 --directory frontend
```
Then visit `http://localhost:8080/login.html`.

### Option 2: Express Static + API Scaffold (Node.js)
```bash
npm install
npm start
```
The Express server serves `frontend/` and mounts `/api/*` endpoints with MongoDB disabled by default (`DB_ENABLED=false`).
