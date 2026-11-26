/* ==========================================================================
   Pivot Pioneers — Core Application Store, Demo Data, Permissions & Shell
   ========================================================================== */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'pp_platform_state_v1';
  const SESSION_KEY = 'pp_active_session_v1';
  const FREELANCER_SESSION_KEY = 'pp_demo_session_freelancer';
  const CLIENT_SESSION_KEY = 'pp_demo_session_client';

  const CATEGORIES = [
    'Web Development',
    'App Development',
    'Graphic Design',
    'UI/UX Design',
    'Content Writing',
    'Digital Marketing',
    'Data Analysis',
    'Research',
    'Other'
  ];

  const WORKFLOW_STAGES = [
    'Open',
    'In Progress',
    'Submitted',
    'Completed'
  ];

  function createSeedState() {
    const users = [
      // 6 Freelancer Profiles (u_f1 is primary demo freelancer)
      {
        id: 'u_f1',
        role: 'freelancer',
        subRole: 'Student',
        fullName: 'Aarav Mehta',
        email: 'aarav.mehta@demo.pivotpioneers.edu',
        headline: 'Computer Science Senior | Full-Stack Web Developer & UI Engineer',
        about: 'Final-year B.Tech Computer Science student passionate about building accessible web applications, design systems, and student-focused tools. Completed 4 campus and startup freelance builds.',
        education: 'B.Tech in Computer Science & Engineering (2023 – 2027)',
        institution: 'National Institute of Technology, Pune',
        company: '',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'UI/UX Design', 'Figma'],
        experience: [
          {
            title: 'Frontend Engineering Intern',
            organization: 'CloudMint Studio (Demo)',
            period: 'May 2026 – Aug 2026',
            description: 'Built reusable responsive dashboard modules and cut page load weight by 32%.'
          },
          {
            title: 'Web Lead',
            organization: 'Campus Innovation Cell',
            period: '2025 – Present',
            description: 'Mentoring 18 student builders across hackathon and client collaboration sprints.'
          }
        ],
        portfolioProjects: [
          {
            title: 'StudySync Collaborative Planner',
            description: 'Real-time study room scheduler with Kanban milestones for university teams.',
            link: 'https://github.com/demo/studysync',
            tags: ['JavaScript', 'Node.js', 'CSS Grid']
          },
          {
            title: 'EcoTrack Carbon Calculator',
            description: 'Interactive web dashboard visualizing campus energy usage trends.',
            link: 'https://github.com/demo/ecotrack',
            tags: ['Data Viz', 'HTML5', 'REST API']
          }
        ],
        resumeName: 'Aarav_Mehta_Resume_2026.pdf',
        portfolioLinks: [
          { label: 'Personal Portfolio', url: 'https://aarav-demo.example.com' }
        ],
        socialLinks: {
          github: 'https://github.com/aarav-demo',
          linkedin: 'https://linkedin.com/in/aarav-demo',
          website: 'https://aarav-demo.example.com'
        },
        preferences: {
          emailNotifications: true,
          projectAlerts: true,
          messageAlerts: true,
          profileVisibility: 'platform'
        },
        isDemo: true
      },
      {
        id: 'u_f2',
        role: 'freelancer',
        subRole: 'Emerging Talent',
        fullName: 'Maya Lin',
        email: 'maya.lin@demo.pivotpioneers.edu',
        headline: 'Product & UI/UX Designer | Design Systems & Interactive Prototyping',
        about: 'Design graduate specializing in clean SaaS interfaces, user research, and accessible mobile-first workflows.',
        education: 'B.Des in Interaction Design (2022 – 2026)',
        institution: 'Rhode Island Design Collective',
        company: '',
        skills: ['UI/UX Design', 'Figma', 'User Research', 'Wireframing', 'Graphic Design'],
        experience: [
          {
            title: 'Junior UX Freelancer',
            organization: 'BrightSpark EdTech',
            period: '2025 – 2026',
            description: 'Redesigned onboarding flows increasing student activation by 24%.'
          }
        ],
        portfolioProjects: [
          {
            title: 'MedNote Patient Portal UI',
            description: 'Accessible appointment booking and prescription tracker prototype.',
            link: 'https://dribbble.com/demo-maya',
            tags: ['Figma', 'Design System']
          }
        ],
        resumeName: 'Maya_Lin_UX_CV.pdf',
        portfolioLinks: [{ label: 'Dribbble Showcase', url: 'https://dribbble.com/demo-maya' }],
        socialLinks: { github: '', linkedin: 'https://linkedin.com/in/maya-demo', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'public' },
        isDemo: true
      },
      {
        id: 'u_f3',
        role: 'freelancer',
        subRole: 'Independent Freelancer',
        fullName: 'Rohan Kulkarni',
        email: 'rohan.k@demo.pivotpioneers.edu',
        headline: 'Data Analyst & Python Research Specialist',
        about: 'Statistics & Data Science postgraduate turning messy survey and product telemetry into executive dashboards and clear reports.',
        education: 'M.Sc. Applied Data Science',
        institution: 'University of Toronto',
        company: '',
        skills: ['Data Analysis', 'Python', 'SQL', 'Tableau', 'Research', 'Excel'],
        experience: [
          {
            title: 'Research Data Fellow',
            organization: 'Civic Metrics Lab',
            period: '2025 – 2026',
            description: 'Cleaned and modeled 120k+ civic transit records for quarterly policy briefs.'
          }
        ],
        portfolioProjects: [
          {
            title: 'Retail Churn Cohort Notebook',
            description: 'Predictive cohort retention analysis with executive visual summaries.',
            link: 'https://github.com/demo/churn-analysis',
            tags: ['Python', 'Data Analysis']
          }
        ],
        resumeName: 'Rohan_Kulkarni_Data_Resume.pdf',
        portfolioLinks: [{ label: 'Kaggle Notebooks', url: 'https://kaggle.com/demo-rohan' }],
        socialLinks: { github: 'https://github.com/rohan-demo', linkedin: 'https://linkedin.com/in/rohan-demo', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
        isDemo: true
      },
      {
        id: 'u_f4',
        role: 'freelancer',
        subRole: 'Student',
        fullName: 'Elena Rostova',
        email: 'elena.r@demo.pivotpioneers.edu',
        headline: 'Mobile App Developer | Flutter & React Native',
        about: 'Undergraduate software engineer building cross-platform iOS/Android utilities for startups and university clubs.',
        education: 'B.S. Software Engineering',
        institution: 'TU Delft',
        company: '',
        skills: ['App Development', 'Flutter', 'React Native', 'Firebase', 'JavaScript'],
        experience: [
          {
            title: 'Mobile App Contributor',
            organization: 'OpenCampus Transit',
            period: '2025 – Present',
            description: 'Shipped live shuttle ETA notifications to 4,200 student users.'
          }
        ],
        portfolioProjects: [
          {
            title: 'FocusSprint Pomodoro App',
            description: 'Offline-first study timer with ambient soundscapes and weekly streaks.',
            link: 'https://github.com/demo/focussprint',
            tags: ['App Development', 'Flutter']
          }
        ],
        resumeName: 'Elena_Rostova_Mobile_CV.pdf',
        portfolioLinks: [],
        socialLinks: { github: 'https://github.com/elena-demo', linkedin: '', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'public' },
        isDemo: true
      },
      {
        id: 'u_f5',
        role: 'freelancer',
        subRole: 'Emerging Talent',
        fullName: 'Devon Brooks',
        email: 'devon.b@demo.pivotpioneers.edu',
        headline: 'Technical Content Writer & B2B Growth Strategist',
        about: 'Communications major crafting developer documentation, SEO product guides, and launch campaigns for early-stage teams.',
        education: 'B.A. Media & Digital Communications',
        institution: 'Boston University',
        company: '',
        skills: ['Content Writing', 'Digital Marketing', 'SEO', 'Copywriting', 'Research'],
        experience: [
          {
            title: 'Editorial Freelancer',
            organization: 'LaunchPad Weekly',
            period: '2024 – 2026',
            description: 'Published 35+ deep-dive SaaS case studies and onboarding playbooks.'
          }
        ],
        portfolioProjects: [
          {
            title: 'API Onboarding Docs Revamp',
            description: 'Restructured developer quickstart guides, cutting support tickets by 18%.',
            link: 'https://medium.com/@demo-devon',
            tags: ['Content Writing', 'SEO']
          }
        ],
        resumeName: 'Devon_Brooks_Portfolio_Resume.pdf',
        portfolioLinks: [{ label: 'Writing Archive', url: 'https://medium.com/@demo-devon' }],
        socialLinks: { github: '', linkedin: 'https://linkedin.com/in/devon-demo', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
        isDemo: true
      },
      {
        id: 'u_f6',
        role: 'freelancer',
        subRole: 'Independent Freelancer',
        fullName: 'Sana Kapoor',
        email: 'sana.k@demo.pivotpioneers.edu',
        headline: 'Brand Identity & Graphic Designer | Motion & Pitch Decks',
        about: 'Visual designer helping founders and student ventures craft trustworthy logos, social kits, and investor pitch decks.',
        education: 'Diploma in Visual Communication',
        institution: 'Srishti Institute of Art & Design',
        company: '',
        skills: ['Graphic Design', 'Illustrator', 'Brand Identity', 'Pitch Decks', 'UI/UX Design'],
        experience: [
          {
            title: 'Brand Design Partner',
            organization: 'SeedStage Collective',
            period: '2024 – Present',
            description: 'Created visual identities and launch assets for 9 university spinouts.'
          }
        ],
        portfolioProjects: [
          {
            title: 'Kinetix Cleantech Brand Kit',
            description: 'Complete typography, color palette, and 20-slide investor deck.',
            link: 'https://behance.net/demo-sana',
            tags: ['Graphic Design', 'Branding']
          }
        ],
        resumeName: 'Sana_Kapoor_Design_Resume.pdf',
        portfolioLinks: [{ label: 'Behance', url: 'https://behance.net/demo-sana' }],
        socialLinks: { github: '', linkedin: 'https://linkedin.com/in/sana-demo', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'public' },
        isDemo: true
      },

      // 4 Client Profiles (u_c1 is primary demo client)
      {
        id: 'u_c1',
        role: 'client',
        subRole: 'Project Owner',
        fullName: 'Priya Nair',
        email: 'priya.nair@demo.novacampus.io',
        headline: 'Product Lead at NovaCampus Labs (Demo Client)',
        about: 'Building collaborative software tools for university incubators and student entrepreneurs. Actively mentoring emerging student talent through real scoped projects.',
        education: 'MBA in Technology Management',
        institution: 'Indian School of Business',
        company: 'NovaCampus Labs',
        skills: ['Product Strategy', 'Web Platforms', 'EdTech', 'Agile Delivery'],
        experience: [
          {
            title: 'Head of Product',
            organization: 'NovaCampus Labs (Demo)',
            period: '2023 – Present',
            description: 'Leading product partnerships across 14 partner campuses.'
          }
        ],
        portfolioProjects: [],
        resumeName: '',
        portfolioLinks: [{ label: 'NovaCampus Portal', url: 'https://novacampus.example.com' }],
        socialLinks: { github: '', linkedin: 'https://linkedin.com/in/priya-demo', website: 'https://novacampus.example.com' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
        isDemo: true
      },
      {
        id: 'u_c2',
        role: 'client',
        subRole: 'Business Owner',
        fullName: 'Marcus Vance',
        email: 'marcus@demo.veridianhealth.com',
        headline: 'Operations Director at Veridian Health Analytics',
        about: 'Healthcare analytics boutique seeking sharp data analysts, researchers, and frontend builders for quarterly client engagements.',
        education: 'M.S. Health Informatics',
        institution: 'Johns Hopkins University',
        company: 'Veridian Health Analytics',
        skills: ['Healthcare Data', 'Analytics', 'Compliance Reporting'],
        experience: [],
        portfolioProjects: [],
        resumeName: '',
        portfolioLinks: [],
        socialLinks: { github: '', linkedin: 'https://linkedin.com/in/marcus-demo', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
        isDemo: true
      },
      {
        id: 'u_c3',
        role: 'client',
        subRole: 'Recruiter',
        fullName: 'Claire Bennett',
        email: 'claire@demo.brightspark.co',
        headline: 'Talent & Venture Partner at BrightSpark EdTech',
        about: 'Connecting university designers, writers, and mobile developers with paid pilot projects at BrightSpark portfolio startups.',
        education: 'B.A. Organizational Psychology',
        institution: 'University of Michigan',
        company: 'BrightSpark EdTech',
        skills: ['Talent Scouting', 'EdTech', 'UI/UX Hiring'],
        experience: [],
        portfolioProjects: [],
        resumeName: '',
        portfolioLinks: [],
        socialLinks: { github: '', linkedin: '', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
        isDemo: true
      },
      {
        id: 'u_c4',
        role: 'client',
        subRole: 'Project Owner',
        fullName: 'Kenji Sato',
        email: 'kenji@demo.driftwoodstudio.jp',
        headline: 'Creative Founder at Driftwood Digital Studio',
        about: 'Independent design & web boutique collaborating with emerging talent on brand identity, marketing campaigns, and custom web builds.',
        education: 'B.F.A. Communication Design',
        institution: 'Tama Art University',
        company: 'Driftwood Digital Studio',
        skills: ['Brand Strategy', 'Digital Campaigns', 'Creative Direction'],
        experience: [],
        portfolioProjects: [],
        resumeName: '',
        portfolioLinks: [],
        socialLinks: { github: '', linkedin: '', website: '' },
        preferences: { emailNotifications: true, projectAlerts: true, messageAlerts: true, profileVisibility: 'platform' },
        isDemo: true
      }
    ];

    // 14 Realistic Sample Projects (12 Open for Browse 2 full 3x2 pages + 1 Active + 1 Completed)
    const projects = [
      {
        id: 'p_101',
        title: 'Student Venture Showcase Web Portal',
        category: 'Web Development',
        description: 'Build a responsive showcase portal where student founders can submit project demos, filter by cohort, and share investor-ready profiles.',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'REST API'],
        budget: 950,
        duration: '3 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-18',
        requirements: 'Clean modular code, mobile-first layout, and accessible form validation.',
        clientId: 'u_c1',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-24T10:00:00Z'
      },
      {
        id: 'p_102',
        title: 'Campus Shuttle Live Tracker Mobile UI',
        category: 'UI/UX Design',
        description: 'Design an intuitive mobile app UI in Figma for live campus bus tracking, route alerts, and accessibility mode for first-year students.',
        skills: ['UI/UX Design', 'Figma', 'Wireframing'],
        budget: 700,
        duration: '2 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-12',
        requirements: 'Deliver interactive prototype with light/dark contrast tokens.',
        clientId: 'u_c3',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-23T14:30:00Z'
      },
      {
        id: 'p_103',
        title: 'Cross-Platform Study Group Companion App',
        category: 'App Development',
        description: 'Develop an MVP mobile app allowing students to form topic-based study pods, schedule check-ins, and track shared revision goals.',
        skills: ['Flutter', 'App Development', 'Firebase'],
        budget: 1800,
        duration: '5 Weeks',
        freelancersRequired: 2,
        deadline: '2027-01-08',
        requirements: 'Clean state management and offline local cache support.',
        clientId: 'u_c1',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-22T09:15:00Z'
      },
      {
        id: 'p_104',
        title: 'Telehealth Patient Satisfaction Data Audit',
        category: 'Data Analysis',
        description: 'Analyze 25,000 anonymized clinic feedback responses using Python or SQL to uncover wait-time bottlenecks and regional trends.',
        skills: ['Data Analysis', 'Python', 'SQL', 'Tableau'],
        budget: 1200,
        duration: '3 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-20',
        requirements: 'Deliver reproducible notebook plus 8-slide summary deck.',
        clientId: 'u_c2',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-21T16:40:00Z'
      },
      {
        id: 'p_105',
        title: 'Cleantech Accelerator Brand & Pitch Deck',
        category: 'Graphic Design',
        description: 'Create a cohesive visual identity, event banner pack, and 16-slide investor pitch template for our winter university climate cohort.',
        skills: ['Graphic Design', 'Brand Identity', 'Pitch Decks'],
        budget: 850,
        duration: '2 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-10',
        requirements: 'Provide editable source files and print-ready PDF exports.',
        clientId: 'u_c4',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-20T11:20:00Z'
      },
      {
        id: 'p_106',
        title: 'Developer API Quickstart & Tutorial Series',
        category: 'Content Writing',
        description: 'Author 5 structured developer guides covering authentication, webhooks, and error handling with realistic code snippets.',
        skills: ['Content Writing', 'Research', 'SEO'],
        budget: 650,
        duration: '2 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-14',
        requirements: 'Clear technical tone tested against our sandbox API docs.',
        clientId: 'u_c1',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-19T13:00:00Z'
      },
      {
        id: 'p_107',
        title: 'EdTech Spring Cohort Social Growth Campaign',
        category: 'Digital Marketing',
        description: 'Plan and craft a 4-week LinkedIn & Instagram launch calendar targeting university engineering societies and bootcamp grads.',
        skills: ['Digital Marketing', 'Copywriting', 'SEO'],
        budget: 600,
        duration: '4 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-28',
        requirements: 'Include KPI tracking sheet and 12 ready-to-publish post drafts.',
        clientId: 'u_c3',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-18T10:10:00Z'
      },
      {
        id: 'p_108',
        title: 'AI Tutoring Ethics & Market Benchmark Brief',
        category: 'Research',
        description: 'Conduct structured secondary research comparing 10 academic AI tutoring platforms across privacy, citations, and pricing models.',
        skills: ['Research', 'Data Analysis', 'Content Writing'],
        budget: 780,
        duration: '2 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-15',
        requirements: 'Include verified citations and comparison matrix.',
        clientId: 'u_c3',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-17T15:45:00Z'
      },
      {
        id: 'p_109',
        title: 'Interactive Clinic Metrics Dashboard Frontend',
        category: 'Web Development',
        description: 'Build a responsive analytics frontend with filterable KPI cards, date-range selectors, and CSV export using modern JavaScript.',
        skills: ['JavaScript', 'CSS3', 'HTML5', 'React'],
        budget: 1450,
        duration: '4 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-30',
        requirements: 'WCAG AA contrast compliance and zero console errors.',
        clientId: 'u_c2',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-16T08:50:00Z'
      },
      {
        id: 'p_110',
        title: 'Minimalist Packaging & Sticker Pack for Hardware Kit',
        category: 'Graphic Design',
        description: 'Design print-ready box sleeves, quick-start insert card, and holographic emblem stickers for a student robotics starter kit.',
        skills: ['Graphic Design', 'Illustrator', 'Brand Identity'],
        budget: 520,
        duration: '10 Days',
        freelancersRequired: 1,
        deadline: '2026-12-09',
        requirements: 'CMYK dieline files in vector format.',
        clientId: 'u_c4',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-15T12:25:00Z'
      },
      {
        id: 'p_111',
        title: 'Accessibility Audit & Remediation Checklist',
        category: 'Other',
        description: 'Evaluate our 8-page web platform for keyboard navigation, screen-reader labels, and focus states, and provide prioritized fixes.',
        skills: ['UI/UX Design', 'HTML5', 'Research'],
        budget: 480,
        duration: '1 Week',
        freelancersRequired: 1,
        deadline: '2026-12-07',
        requirements: 'Detailed issue log with concrete HTML/ARIA code examples.',
        clientId: 'u_c1',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-14T17:15:00Z'
      },
      {
        id: 'p_112',
        title: 'Flutter Habit & Wellness Companion Prototype',
        category: 'App Development',
        description: 'Build an interactive 6-screen Flutter prototype with smooth micro-animations and local SQLite persistence for pilot user testing.',
        skills: ['App Development', 'Flutter', 'UI/UX Design'],
        budget: 1350,
        duration: '3 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-22',
        requirements: 'APK build + Git repository handover.',
        clientId: 'u_c2',
        status: 'Open',
        selectedFreelancerIds: [],
        submission: null,
        createdAt: '2026-11-13T09:00:00Z'
      },
      // Active project already accepted for Aarav (u_f1) from Priya (u_c1)
      {
        id: 'p_113',
        title: 'Incubator Cohort Onboarding Microsite',
        category: 'Web Development',
        description: 'Responsive onboarding checklist and mentor directory microsite for incoming winter cohort startups.',
        skills: ['HTML5', 'CSS3', 'JavaScript'],
        budget: 900,
        duration: '2 Weeks',
        freelancersRequired: 1,
        deadline: '2026-12-05',
        requirements: 'Deployable static bundle with clean documentation.',
        clientId: 'u_c1',
        status: 'In Progress',
        selectedFreelancerIds: ['u_f1'],
        submission: null,
        createdAt: '2026-11-10T10:00:00Z'
      },
      // Completed project for immediate Feedback & Experience Certificate demo
      {
        id: 'p_114',
        title: 'University Career Fair Interactive Map',
        category: 'UI/UX Design',
        description: 'Designed and coded an interactive booth locator and employer filter page used by 1,500+ students during Fall Career Week.',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design'],
        budget: 750,
        duration: '2 Weeks',
        freelancersRequired: 1,
        deadline: '2026-11-05',
        requirements: 'Mobile-friendly booth search and QR share link.',
        clientId: 'u_c1',
        status: 'Completed',
        selectedFreelancerIds: ['u_f1'],
        submission: {
          summary: 'Delivered responsive booth directory with instant company search and print-ready floor map.',
          deliverableUrl: 'https://github.com/aarav-demo/career-fair-map',
          submittedAt: '2026-11-03T16:20:00Z',
          approvedAt: '2026-11-04T11:10:00Z'
        },
        createdAt: '2026-10-20T09:00:00Z'
      }
    ];

    const applications = [
      {
        id: 'a_201',
        projectId: 'p_101',
        freelancerId: 'u_f1',
        clientId: 'u_c1',
        coverNote: 'I recently built a cohort directory for our Campus Innovation Cell using modular vanilla JS and glassmorphic UI patterns. Ready to start immediately.',
        proposedTimeline: '3 Weeks',
        status: 'Shortlisted',
        createdAt: '2026-11-24T12:15:00Z'
      },
      {
        id: 'a_202',
        projectId: 'p_109',
        freelancerId: 'u_f1',
        clientId: 'u_c2',
        coverNote: 'Strong experience in accessible KPI dashboards and CSV export utilities. Happy to share live code samples.',
        proposedTimeline: '3.5 Weeks',
        status: 'Pending',
        createdAt: '2026-11-23T18:00:00Z'
      },
      {
        id: 'a_203',
        projectId: 'p_102',
        freelancerId: 'u_f2',
        clientId: 'u_c3',
        coverNote: 'Interaction design graduate with EdTech onboarding experience; I can deliver a tested Figma component library.',
        proposedTimeline: '2 Weeks',
        status: 'Under Review',
        createdAt: '2026-11-24T09:05:00Z'
      },
      {
        id: 'a_204',
        projectId: 'p_106',
        freelancerId: 'u_f5',
        clientId: 'u_c1',
        coverNote: 'Published 35+ API guides and developer onboarding walkthroughs. Excited to work with NovaCampus Labs.',
        proposedTimeline: '12 Days',
        status: 'Pending',
        createdAt: '2026-11-22T15:30:00Z'
      },
      {
        id: 'a_205',
        projectId: 'p_113',
        freelancerId: 'u_f1',
        clientId: 'u_c1',
        coverNote: 'Would love to build the cohort onboarding microsite with a clean directory search.',
        proposedTimeline: '2 Weeks',
        status: 'Accepted',
        createdAt: '2026-11-11T09:00:00Z'
      },
      {
        id: 'a_206',
        projectId: 'p_114',
        freelancerId: 'u_f1',
        clientId: 'u_c1',
        coverNote: 'Experienced in lightweight interactive campus maps and responsive directories.',
        proposedTimeline: '2 Weeks',
        status: 'Accepted',
        createdAt: '2026-10-21T10:00:00Z'
      },
      {
        id: 'a_207',
        projectId: 'p_105',
        freelancerId: 'u_f6',
        clientId: 'u_c4',
        coverNote: 'Designed 9 university spinout brand kits and investor decks; portfolio attached.',
        proposedTimeline: '2 Weeks',
        status: 'Shortlisted',
        createdAt: '2026-11-21T11:40:00Z'
      },
      {
        id: 'a_208',
        projectId: 'p_104',
        freelancerId: 'u_f3',
        clientId: 'u_c2',
        coverNote: 'M.Sc. Data Science specialist with healthcare survey normalization experience.',
        proposedTimeline: '2.5 Weeks',
        status: 'Under Review',
        createdAt: '2026-11-22T14:00:00Z'
      }
    ];

    const conversations = [
      {
        id: 'conv_301',
        projectId: 'p_113',
        participants: ['u_f1', 'u_c1'],
        unreadBy: { u_f1: 1, u_c1: 0 },
        messages: [
          {
            id: 'm_1',
            senderId: 'u_c1',
            text: 'Welcome aboard Aarav! Feel free to share the first wireframe of the cohort onboarding microsite whenever ready.',
            timestamp: '2026-11-24T09:30:00Z'
          },
          {
            id: 'm_2',
            senderId: 'u_f1',
            text: 'Thanks Priya! I have structured the mentor directory cards and responsive layout—aiming to submit the preview build tomorrow.',
            timestamp: '2026-11-24T11:15:00Z'
          },
          {
            id: 'm_3',
            senderId: 'u_c1',
            text: 'Sounds great. Make sure the onboarding checklist items save state nicely for returning founders.',
            timestamp: '2026-11-25T08:45:00Z'
          }
        ]
      },
      {
        id: 'conv_302',
        projectId: 'p_101',
        participants: ['u_f1', 'u_c1'],
        unreadBy: { u_f1: 0, u_c1: 1 },
        messages: [
          {
            id: 'm_4',
            senderId: 'u_c1',
            text: 'Hi Aarav, we shortlisted your application for the Student Venture Showcase Portal. Are you available for a quick scope sync?',
            timestamp: '2026-11-24T16:20:00Z'
          }
        ]
      },
      {
        id: 'conv_303',
        projectId: 'p_106',
        participants: ['u_f5', 'u_c1'],
        unreadBy: { u_f5: 0, u_c1: 1 },
        messages: [
          {
            id: 'm_5',
            senderId: 'u_f5',
            text: 'Hello Priya, I attached two sample developer tutorials in my profile for your API Quickstart project.',
            timestamp: '2026-11-23T14:10:00Z'
          }
        ]
      }
    ];

    const notifications = [
      {
        id: 'n_1',
        userId: 'u_f1',
        type: 'application',
        title: 'Application Shortlisted',
        body: 'Priya Nair shortlisted your application for "Student Venture Showcase Web Portal".',
        link: 'projects.html?view=applications',
        read: false,
        createdAt: '2026-11-25T08:50:00Z'
      },
      {
        id: 'n_2',
        userId: 'u_f1',
        type: 'message',
        title: 'New Message from Priya Nair',
        body: 'Sounds great. Make sure the onboarding checklist items save state nicely...',
        link: 'messages.html?conv=conv_301',
        read: false,
        createdAt: '2026-11-25T08:45:00Z'
      },
      {
        id: 'n_3',
        userId: 'u_f1',
        type: 'certificate',
        title: 'Experience Certificate Ready',
        body: 'Your Experience Certificate for "University Career Fair Interactive Map" is available to view & print.',
        link: 'dashboard.html?view=certificates',
        read: true,
        createdAt: '2026-11-04T11:20:00Z'
      },
      {
        id: 'n_4',
        userId: 'u_c1',
        type: 'application',
        title: 'New Applicant Received',
        body: 'Devon Brooks applied for "Developer API Quickstart & Tutorial Series".',
        link: 'projects.html?view=applicants',
        read: false,
        createdAt: '2026-11-24T15:30:00Z'
      },
      {
        id: 'n_5',
        userId: 'u_c1',
        type: 'feedback',
        title: 'Feedback Received',
        body: 'Aarav Mehta left a 5-star review on "University Career Fair Interactive Map".',
        link: 'dashboard.html?view=certificates',
        read: false,
        createdAt: '2026-11-04T14:00:00Z'
      }
    ];

    const feedbacks = [
      {
        id: 'fb_1',
        projectId: 'p_114',
        fromUserId: 'u_c1',
        toUserId: 'u_f1',
        rating: 5,
        comment: 'Aarav delivered ahead of schedule with clean, accessible code and thoughtful responsive touches for mobile student users.',
        createdAt: '2026-11-04T12:00:00Z'
      },
      {
        id: 'fb_2',
        projectId: 'p_114',
        fromUserId: 'u_f1',
        toUserId: 'u_c1',
        rating: 5,
        comment: 'Clear project requirements, fast milestone reviews, and a supportive collaboration experience.',
        createdAt: '2026-11-04T14:00:00Z'
      }
    ];

    const certificates = [
      {
        id: 'cert_1',
        projectId: 'p_114',
        freelancerId: 'u_f1',
        clientId: 'u_c1',
        issuedAt: '2026-11-04',
        code: 'PP-DEMO-2026-114'
      }
    ];

    return {
      users,
      projects,
      applications,
      conversations,
      notifications,
      feedbacks,
      certificates
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seed = createSeedState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw);
    } catch (_err) {
      const seed = createSeedState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  }

  function setSession(user, rememberMe = true) {
    const payload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      rememberMe: Boolean(rememberMe),
      signedInAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    if (user.role === 'freelancer') {
      localStorage.setItem(FREELANCER_SESSION_KEY, JSON.stringify(payload));
    } else {
      localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(payload));
    }
    return payload;
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    const state = loadState();
    return state.users.find((u) => u.id === session.userId) || null;
  }

  function requireAuthPage() {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  }

  function switchDemoRole(targetRole) {
    const state = loadState();
    const savedKey = targetRole === 'client' ? CLIENT_SESSION_KEY : FREELANCER_SESSION_KEY;
    let targetUser = null;
    try {
      const saved = JSON.parse(localStorage.getItem(savedKey) || 'null');
      if (saved) {
        targetUser = state.users.find((u) => u.id === saved.userId && u.role === targetRole);
      }
    } catch (_err) {}
    if (!targetUser) {
      targetUser = state.users.find((u) => u.role === targetRole);
    }
    if (targetUser) {
      setSession(targetUser, true);
      window.location.reload();
    }
  }

  function addNotification(userId, payload) {
    const state = loadState();
    state.notifications.unshift({
      id: 'n_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId,
      type: payload.type || 'update',
      title: payload.title,
      body: payload.body,
      link: payload.link || 'dashboard.html',
      read: false,
      createdAt: new Date().toISOString()
    });
    saveState(state);
  }

  // Ensure or open a contextual conversation between two users
  function ensureConversation(projectId, userA, userB) {
    const state = loadState();
    let conv = state.conversations.find(
      (c) =>
        c.projectId === projectId &&
        c.participants.includes(userA) &&
        c.participants.includes(userB)
    );
    if (!conv) {
      conv = {
        id: 'conv_' + Date.now(),
        projectId,
        participants: [userA, userB],
        unreadBy: { [userA]: 0, [userB]: 0 },
        messages: []
      };
      state.conversations.unshift(conv);
      saveState(state);
    }
    return conv;
  }

  // Socket.IO-ready lightweight client adapter
  const SocketAdapter = {
    listeners: {},
    on(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    },
    emit(event, payload) {
      (this.listeners[event] || []).forEach((fn) => fn(payload));
    }
  };

  // Security & formatting helpers
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initials(name) {
    const parts = String(name || 'PP').trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0] ? p[0].toUpperCase() : '').join('') || 'PP';
  }

  function formatCurrency(amount) {
    return '$' + Number(amount || 0).toLocaleString('en-US');
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function statusBadgeClass(status) {
    switch (status) {
      case 'Open':
      case 'Accepted':
      case 'Completed':
        return 'badge-success';
      case 'Pending':
      case 'Under Review':
      case 'In Progress':
      case 'Submitted':
        return 'badge-blue';
      case 'Shortlisted':
      case 'Draft':
        return 'badge-warning';
      case 'Rejected':
      case 'Closed':
      case 'Withdrawn':
        return 'badge-danger';
      default:
        return 'badge-silver';
    }
  }

  // Toast Notification
  function showToast(message, type = 'info') {
    let stack = document.getElementById('ppToastStack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'ppToastStack';
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 220);
    }, 3400);
  }

  // Reusable Modal
  function openModal(title, bodyHtml, maxWidth = '720px') {
    let backdrop = document.getElementById('ppGlobalModal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'ppGlobalModal';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="ppModalTitle">
          <div class="modal-header">
            <h2 id="ppModalTitle" style="margin:0;font-size:1.3rem;"></h2>
            <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div id="ppModalBody"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop || e.target.closest('.modal-close')) {
          closeModal();
        }
      });
    }
    const dialog = backdrop.querySelector('.modal-dialog');
    dialog.style.maxWidth = maxWidth;
    backdrop.querySelector('#ppModalTitle').textContent = title;
    backdrop.querySelector('#ppModalBody').innerHTML = bodyHtml;
    backdrop.classList.add('open');
    return backdrop;
  }

  function closeModal() {
    const backdrop = document.getElementById('ppGlobalModal');
    if (backdrop) backdrop.classList.remove('open');
  }

  // Clean inline SVG Icons
  const ICONS = {
    overview: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    browse: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    post: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    applications: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></svg>',
    projects: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    messages: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    profile: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>',
    certificates: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>',
    settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    logout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    applicants: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  };

  function renderAppShell(activeNavKey) {
    const user = requireAuthPage();
    if (!user) return null;

    const state = loadState();
    const unreadNotifs = state.notifications.filter((n) => n.userId === user.id && !n.read);
    const unreadMsgs = state.conversations
      .filter((c) => c.participants.includes(user.id))
      .reduce((acc, c) => acc + (c.unreadBy[user.id] || 0), 0);

    const isClient = user.role === 'client';
    const isFreelancer = user.role === 'freelancer';

    const sidebarItems = [
      { key: 'overview', label: 'Overview', icon: ICONS.overview, href: 'dashboard.html', allowed: true },
      { key: 'browse', label: 'Browse Projects', icon: ICONS.browse, href: 'projects.html?view=browse', allowed: true },
      { key: 'post', label: 'Post a Project', icon: ICONS.post, href: 'projects.html?view=post', allowed: isClient, lockHint: 'Client only' },
      { key: 'applications', label: 'My Applications', icon: ICONS.applications, href: 'projects.html?view=applications', allowed: isFreelancer, lockHint: 'Freelancer only' },
      { key: 'my-projects', label: 'My Projects', icon: ICONS.projects, href: 'projects.html?view=my-projects', allowed: true },
      { key: 'messages', label: 'Messages', icon: ICONS.messages, href: 'messages.html', allowed: true, badge: unreadMsgs },
      { key: 'profile', label: 'My Profile', icon: ICONS.profile, href: 'profile.html', allowed: true },
      { key: 'certificates', label: 'Feedback & Certificates', icon: ICONS.certificates, href: 'dashboard.html?view=certificates', allowed: true },
      { key: 'settings', label: 'Settings', icon: ICONS.settings, href: 'dashboard.html?view=settings', allowed: true }
    ];

    const topbarEl = document.getElementById('ppTopbar');
    const sidebarEl = document.getElementById('ppSidebar');

    if (topbarEl) {
      topbarEl.innerHTML = `
        <div class="topbar-left">
          <button type="button" class="mobile-menu-btn" id="ppMobileMenuBtn" aria-label="Toggle navigation menu">
            ${ICONS.menu}
          </button>
          <a href="dashboard.html" class="brand-lockup">
            <img src="assets/logo.png" alt="Pivot Pioneers logo" />
            <div>
              <div class="brand-title">Pivot Pioneers</div>
              <div class="brand-subtitle">Student &amp; Freelance Network</div>
            </div>
          </a>
        </div>

        <div class="topbar-search">
          <span class="topbar-search-icon">${ICONS.browse}</span>
          <input
            type="search"
            id="ppGlobalSearch"
            class="topbar-search-input"
            placeholder="Search projects, freelancers, clients, skills, categories..."
            aria-label="Global Search"
            autocomplete="off"
          />
          <div id="ppSearchDropdown" class="search-results-dropdown" role="region" aria-label="Search results"></div>
        </div>

        <div class="topbar-right">
          <div class="popover-wrap">
            <button type="button" class="icon-btn" id="ppNotifBtn" aria-label="Notifications">
              ${ICONS.bell}
              ${unreadNotifs.length ? `<span class="notif-count">${unreadNotifs.length}</span>` : ''}
            </button>
            <div class="popover-panel" id="ppNotifPanel">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <strong style="font-size:0.95rem;">Notifications</strong>
                <button type="button" class="auth-link text-xs" id="ppMarkAllRead">Mark all read</button>
              </div>
              <div class="notif-list" id="ppNotifList"></div>
            </div>
          </div>

          <div class="popover-wrap">
            <button type="button" class="profile-trigger" id="ppProfileMenuBtn" aria-label="Open profile menu">
              <div class="avatar avatar-sm">${escapeHtml(initials(user.fullName))}</div>
              <div class="profile-trigger-meta">
                <div class="profile-trigger-name">${escapeHtml(user.fullName)}</div>
                <div class="profile-trigger-role">${escapeHtml(user.role)} · ${escapeHtml(user.subRole || 'Demo')}</div>
              </div>
            </button>
            <div class="popover-panel" id="ppProfileMenuPanel" style="width:240px;">
              <div style="padding:6px 8px 10px;border-bottom:1px solid rgba(113,128,150,0.2);">
                <div style="font-weight:700;font-size:0.9rem;">${escapeHtml(user.fullName)}</div>
                <div class="text-xs text-muted">${escapeHtml(user.email)}</div>
              </div>
              <div style="display:flex;flex-direction:column;gap:4px;margin-top:8px;">
                <a href="profile.html" class="sidebar-link" style="padding:8px 10px;">My Profile</a>
                <a href="dashboard.html?view=settings" class="sidebar-link" style="padding:8px 10px;">Settings</a>
                <button type="button" class="sidebar-link" id="ppSwitchDemoRole" style="padding:8px 10px;">
                  Switch to ${isClient ? 'Demo Freelancer' : 'Demo Client'}
                </button>
                <button type="button" class="sidebar-link" id="ppTopLogoutBtn" style="padding:8px 10px;color:#b91c1c;">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (sidebarEl) {
      sidebarEl.innerHTML = `
        <nav class="sidebar-nav" aria-label="Main navigation">
          ${sidebarItems
            .map((item) => {
              const activeCls = item.key === activeNavKey ? 'active' : '';
              const disabledCls = item.allowed ? '' : 'disabled';
              const tag = item.allowed ? 'a' : 'button';
              const attrs = item.allowed
                ? `href="${item.href}"`
                : `type="button" aria-disabled="true" title="${item.lockHint}" data-locked="${item.lockHint}"`;
              return `
                <${tag} class="sidebar-link ${activeCls} ${disabledCls}" ${attrs}>
                  <span class="sidebar-link-main">${item.icon}<span>${item.label}</span></span>
                  ${item.badge ? `<span class="sidebar-badge">${item.badge}</span>` : ''}
                  ${!item.allowed ? `<span class="sidebar-lock">${item.lockHint}</span>` : ''}
                </${tag}>
              `;
            })
            .join('')}
        </nav>
        <div class="sidebar-footer">
          <button type="button" class="sidebar-link" id="ppSidebarLogoutBtn" style="color:#b91c1c;">
            <span class="sidebar-link-main">${ICONS.logout}<span>Logout</span></span>
          </button>
        </div>
      `;
    }

    bindShellEvents(user);
    return user;
  }

  function renderNotificationsList(user) {
    const listEl = document.getElementById('ppNotifList');
    if (!listEl) return;
    const state = loadState();
    const mine = state.notifications.filter((n) => n.userId === user.id);
    if (!mine.length) {
      listEl.innerHTML = '<div class="text-sm text-muted" style="padding:14px;text-align:center;">No notifications yet.</div>';
      return;
    }
    listEl.innerHTML = mine
      .slice(0, 12)
      .map(
        (n) => `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-notif-id="${n.id}" data-link="${escapeHtml(n.link)}">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
          <strong style="font-size:0.83rem;">${escapeHtml(n.title)}</strong>
          <span class="text-xs text-muted">${formatDate(n.createdAt)}</span>
        </div>
        <div class="text-xs text-muted" style="margin-top:4px;line-height:1.4;">${escapeHtml(n.body)}</div>
      </div>
    `
      )
      .join('');
  }

  function bindShellEvents(user) {
    const notifBtn = document.getElementById('ppNotifBtn');
    const notifPanel = document.getElementById('ppNotifPanel');
    const profileBtn = document.getElementById('ppProfileMenuBtn');
    const profilePanel = document.getElementById('ppProfileMenuPanel');
    const mobileBtn = document.getElementById('ppMobileMenuBtn');
    const sidebarEl = document.getElementById('ppSidebar');
    const backdropEl = document.getElementById('ppSidebarBackdrop');

    renderNotificationsList(user);

    if (notifBtn && notifPanel) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePanel?.classList.remove('open');
        notifPanel.classList.toggle('open');
      });
    }

    if (profileBtn && profilePanel) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifPanel?.classList.remove('open');
        profilePanel.classList.toggle('open');
      });
    }

    document.getElementById('ppMarkAllRead')?.addEventListener('click', () => {
      const state = loadState();
      state.notifications.forEach((n) => {
        if (n.userId === user.id) n.read = true;
      });
      saveState(state);
      document.querySelector('.notif-count')?.remove();
      renderNotificationsList(user);
      showToast('All notifications marked as read.', 'success');
    });

    document.getElementById('ppNotifList')?.addEventListener('click', (e) => {
      const item = e.target.closest('.notif-item');
      if (!item) return;
      const state = loadState();
      const target = state.notifications.find((n) => n.id === item.dataset.notifId);
      if (target) {
        target.read = true;
        saveState(state);
      }
      window.location.href = item.dataset.link || 'dashboard.html';
    });

    document.getElementById('ppSwitchDemoRole')?.addEventListener('click', () => {
      switchDemoRole(user.role === 'client' ? 'freelancer' : 'client');
    });

    const handleLogout = () => {
      clearSession();
      window.location.href = 'login.html';
    };
    document.getElementById('ppTopLogoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('ppSidebarLogoutBtn')?.addEventListener('click', handleLogout);

    // Locked sidebar feedback if clicked
    sidebarEl?.addEventListener('click', (e) => {
      const locked = e.target.closest('[data-locked]');
      if (locked) {
        showToast(`Restricted: ${locked.dataset.locked} feature.`, 'info');
      }
    });

    // Mobile drawer toggle
    const toggleSidebar = (forceClose = false) => {
      if (!sidebarEl || !backdropEl) return;
      if (forceClose) {
        sidebarEl.classList.remove('open');
        backdropEl.classList.remove('open');
      } else {
        sidebarEl.classList.toggle('open');
        backdropEl.classList.toggle('open');
      }
    };
    mobileBtn?.addEventListener('click', () => toggleSidebar(false));
    backdropEl?.addEventListener('click', () => toggleSidebar(true));

    // Global Search
    const searchInput = document.getElementById('ppGlobalSearch');
    const searchDropdown = document.getElementById('ppSearchDropdown');
    if (searchInput && searchDropdown) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
          searchDropdown.classList.remove('open');
          searchDropdown.innerHTML = '';
          return;
        }
        const state = loadState();
        const matchedProjects = state.projects
          .filter(
            (p) =>
              p.status !== 'Draft' &&
              (p.title.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.skills.some((s) => s.toLowerCase().includes(q)))
          )
          .slice(0, 5);

        const matchedFreelancers = state.users
          .filter(
            (u) =>
              u.role === 'freelancer' &&
              (u.fullName.toLowerCase().includes(q) ||
                u.headline.toLowerCase().includes(q) ||
                u.skills.some((s) => s.toLowerCase().includes(q)))
          )
          .slice(0, 4);

        const matchedClients = state.users
          .filter(
            (u) =>
              u.role === 'client' &&
              (u.fullName.toLowerCase().includes(q) || (u.company || '').toLowerCase().includes(q))
          )
          .slice(0, 3);

        const matchedCategories = CATEGORIES.filter((c) => c.toLowerCase().includes(q));

        let html = '';
        if (matchedProjects.length) {
          html += `<div class="search-group-label">Projects</div>`;
          html += matchedProjects
            .map(
              (p) => `
              <a class="search-result-item" href="projects.html?view=browse&project=${p.id}">
                <div>
                  <div style="font-weight:600;font-size:0.86rem;">${escapeHtml(p.title)}</div>
                  <div class="text-xs text-muted">${escapeHtml(p.category)} · ${formatCurrency(p.budget)}</div>
                </div>
                <span class="badge badge-blue">${escapeHtml(p.status)}</span>
              </a>`
            )
            .join('');
        }
        if (matchedFreelancers.length) {
          html += `<div class="search-group-label">Freelancers</div>`;
          html += matchedFreelancers
            .map(
              (u) => `
              <a class="search-result-item" href="profile.html?id=${u.id}">
                <div>
                  <div style="font-weight:600;font-size:0.86rem;">${escapeHtml(u.fullName)}</div>
                  <div class="text-xs text-muted">${escapeHtml(u.skills.slice(0, 3).join(', '))}</div>
                </div>
                <span class="badge badge-silver">${escapeHtml(u.subRole || 'Freelancer')}</span>
              </a>`
            )
            .join('');
        }
        if (matchedClients.length) {
          html += `<div class="search-group-label">Clients</div>`;
          html += matchedClients
            .map(
              (u) => `
              <a class="search-result-item" href="profile.html?id=${u.id}">
                <div>
                  <div style="font-weight:600;font-size:0.86rem;">${escapeHtml(u.fullName)}</div>
                  <div class="text-xs text-muted">${escapeHtml(u.company || u.headline)}</div>
                </div>
                <span class="badge badge-silver">Client</span>
              </a>`
            )
            .join('');
        }
        if (matchedCategories.length) {
          html += `<div class="search-group-label">Categories</div>`;
          html += matchedCategories
            .map(
              (c) => `
              <a class="search-result-item" href="projects.html?view=browse&category=${encodeURIComponent(c)}">
                <span style="font-weight:600;font-size:0.86rem;">${escapeHtml(c)}</span>
                <span class="text-xs text-muted">Filter projects</span>
              </a>`
            )
            .join('');
        }

        if (!html) {
          html = `<div class="text-sm text-muted" style="padding:12px;text-align:center;">No matching projects, talent, or skills for "${escapeHtml(q)}".</div>`;
        }
        searchDropdown.innerHTML = html;
        searchDropdown.classList.add('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.popover-wrap')) {
        notifPanel?.classList.remove('open');
        profilePanel?.classList.remove('open');
      }
      if (!e.target.closest('.topbar-search')) {
        searchDropdown?.classList.remove('open');
      }
    });
  }

  window.PivotApp = {
    CATEGORIES,
    WORKFLOW_STAGES,
    ICONS,
    SocketAdapter,
    loadState,
    saveState,
    getSession,
    setSession,
    clearSession,
    getCurrentUser,
    requireAuthPage,
    switchDemoRole,
    addNotification,
    ensureConversation,
    renderAppShell,
    showToast,
    openModal,
    closeModal,
    escapeHtml,
    initials,
    formatCurrency,
    formatDate,
    formatTime,
    statusBadgeClass
  };
})(window);
