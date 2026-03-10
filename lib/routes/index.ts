export const routes = {
  ui: {
    root: "/",
    login: "/login",
    dashboard: "/dashboard",
    projects: "/projects",
    projectDetail: (id: string) => `/projects/${id}`,
    analytics: "/analytics",
    costs: "/costs",
    settings: "/settings",
  },
  api: {
    login: "auth/login",
    logout: "auth/logout",
    getProjects: "projects",
    getProjectById: (id: string) => `projects/${id}`,
    createProject: "projects",
    updateProject: (id: string) => `projects/${id}`,
    deleteProject: (id: string) => `projects/${id}`,
    getMilestones: (projectId: string) => `projects/${projectId}/milestones`,
    createMilestone: (projectId: string) => `projects/${projectId}/milestones`,
    updateMilestone: (projectId: string, id: string) =>
      `projects/${projectId}/milestones/${id}`,
    deleteMilestone: (projectId: string, id: string) =>
      `projects/${projectId}/milestones/${id}`,
    getPayments: (projectId: string) => `projects/${projectId}/payments`,
    createPayment: (projectId: string) => `projects/${projectId}/payments`,
    deletePayment: (projectId: string, id: string) =>
      `projects/${projectId}/payments/${id}`,
    getCosts: (projectId: string) => `projects/${projectId}/costs`,
    getAllCosts: "costs",
    createCost: (projectId: string) => `projects/${projectId}/costs`,
    deleteCost: (projectId: string, id: string) =>
      `projects/${projectId}/costs/${id}`,
    getEditLogs: (projectId: string) => `projects/${projectId}/logs`,
    getMonthlyAnalytics: "analytics/monthly",
    getYearlyAnalytics: "analytics/yearly",
  },
};
