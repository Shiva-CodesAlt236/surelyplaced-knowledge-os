/**
 * Route path constants and builders, mirroring docs/ROUTE_REGISTRY.md
 * exactly. This is the single source of truth for route paths used
 * across the shell — no component should hard-code a path string
 * directly; every path is read from here so a future change to
 * docs/ROUTE_REGISTRY.md has one place in the codebase to update.
 */

export const ROUTES = {
  dashboard: '/dashboard',

  learning: {
    index: '/learning',
    path: (pathId: string) => `/learning/${pathId}`,
  },

  browse: {
    index: '/browse',
    module: (moduleId: string) => `/browse/${moduleId}`,
    candidateIntelligence: '/browse/candidate-intelligence',
    roleCollection: (collectionId: string) => `/browse/candidate-intelligence/${collectionId}`,
    article: (moduleId: string, articleSlug: string) => `/browse/${moduleId}/${articleSlug}`,
    roleCollectionArticle: (collectionId: string, articleSlug: string) =>
      `/browse/candidate-intelligence/${collectionId}/${articleSlug}`,
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
