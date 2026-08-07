/**
 * Route path constants and builders, mirroring docs/ROUTE_REGISTRY.md
 * exactly. This is the single source of truth for route paths used
 * across the shell — no component should hard-code a path string
 * directly; every path is read from here so a future change to
 * docs/ROUTE_REGISTRY.md has one place in the codebase to update.
 */

export const ROUTES = {
  // Milestone 4E, Priority 8: this pointed at "/dashboard", a route
  // that has never existed — the Dashboard has always been rendered at
  // "/" (app/page.tsx). Header's logo link and TopNavigation's
  // "Dashboard" item both used this constant and both 404'd.
  dashboard: '/',
  scripts: '/docs/scripts',

  learning: {
    index: '/learning',
    path: (pathId: string) => `/learning/${pathId}`,
  },

  // Milestone 4E, Priority 8: "browse.*" pointed at a "/browse/*" route
  // tree that was never implemented — the real, working content lives
  // under fumadocs' "/docs/*" tree (app/docs/[[...slug]]/page.tsx).
  // These builders fed both the Dashboard-page Sidebar
  // (lib/content-navigation.ts) and Breadcrumbs (lib/breadcrumbs.ts),
  // so every Sidebar module link and every "Browse"/"Candidate
  // Intelligence" breadcrumb 404'd. Repointed at the real "/docs/*"
  // paths rather than building a new "/browse" section, which would be
  // new functionality outside this stabilization sprint's scope.
  browse: {
    index: '/docs',
    module: (moduleId: string) => {
      if (moduleId === 'candidate-intelligence') return '/docs/candidate-intelligence/business-analysis/overview';
      if (moduleId === 'industry-playbooks') return '/docs/industry-playbooks/industry-discovery-framework';
      if (moduleId === 'sales-operations') return '/docs/sales-operations/sales-workflow-overview';
      if (moduleId === 'visa-playbooks') return '/docs/visa-playbooks/visa-discovery-framework';
      return `/docs/${moduleId}/overview`;
    },
    candidateIntelligence: '/docs/candidate-intelligence/business-analysis/overview',
    roleCollection: (collectionId: string) => `/docs/candidate-intelligence/${collectionId}/overview`,
    article: (moduleId: string, articleSlug: string) => `/docs/${moduleId}/${articleSlug}`,
    roleCollectionArticle: (collectionId: string, articleSlug: string) =>
      `/docs/candidate-intelligence/${collectionId}/${articleSlug}`,
  },

  bookmarks: {
    index: '/bookmarks',
    readingLists: '/bookmarks/reading-lists',
    readingList: (listId: string) => `/bookmarks/reading-lists/${listId}`,
  },

  notes: {
    index: '/notes',
    note: (noteId: string) => `/notes/${noteId}`,
  },

  assessments: {
    quiz: (quizId: string) => `/assessments/quiz/${quizId}`,
    scenario: (testId: string) => `/assessments/scenario/${testId}`,
    roleplay: (roleplayId: string) => `/assessments/roleplay/${roleplayId}`,
    certification: (pathId: string) => `/assessments/certification/${pathId}`,
  },

  certificates: {
    certificate: (certificateId: string) => `/certificates/${certificateId}`,
  },

  search: {
    index: '/search',
    withQuery: (query: string, filters?: { module?: string; topic?: string; role?: string }) => {
      const params = new URLSearchParams({ q: query });
      if (filters?.module) params.set('module', filters.module);
      if (filters?.topic) params.set('topic', filters.topic);
      if (filters?.role) params.set('role', filters.role);
      return `/search?${params.toString()}`;
    },
  },

  ai: {
    index: '/ai',
    withContext: (moduleId: string) => `/ai?context=${moduleId}`,
    history: '/ai/history',
    conversation: (conversationId: string) => `/ai/history/${conversationId}`,
  },

  manager: {
    index: '/manager',
    advisor: (advisorId: string) => `/manager/team/${advisorId}`,
    roleplayReview: (roleplayId: string) => `/manager/roleplay/${roleplayId}/review`,
  },

  trainer: {
    index: '/trainer',
    cohort: (cohortId: string) => `/trainer/cohort/${cohortId}`,
  },

  settings: '/settings',

  admin: {
    index: '/admin',
    users: '/admin/users',
    user: (userId: string) => `/admin/users/${userId}`,
    settings: '/admin/settings',
  },

  auth: {
    login: '/login',
    logout: '/logout',
    onboarding: '/onboarding',
  },

  errors: {
    notFound: '/404',
    forbidden: '/403',
    serverError: '/500',
    offline: '/offline',
  },
} as const;

/**
 * Routes that require an authenticated session, per
 * docs/ROUTE_REGISTRY.md's "Auth" column. Used by a future middleware
 * layer to gate access; listed here now so that gate has one real
 * source of truth to read from once it's implemented.
 */
export const PUBLIC_ROUTES: readonly string[] = [
  ROUTES.auth.login,
  ROUTES.errors.notFound,
  ROUTES.errors.forbidden,
  ROUTES.errors.serverError,
  ROUTES.errors.offline,
];
