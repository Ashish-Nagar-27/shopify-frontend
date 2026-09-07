export interface DashboardDateParams {
  startDate?: string;
  endDate?: string;
}

export const dashboardKeys = {
  all: ["dashboard"] as const,
  graphSales: (params?: DashboardDateParams) =>
    params
      ? (["dashboardGraphSales", params] as const)
      : (["dashboardGraphSales"] as const),
  graphSalesMetrics: (params?: DashboardDateParams) =>
    params
      ? (["dashboardGraphSalesMetrics", params] as const)
      : (["dashboardGraphSalesMetrics"] as const),
  trafficSessions: (params?: DashboardDateParams) =>
    params
      ? (["dashboardTrafficSessions", params] as const)
      : (["dashboardTrafficSessions"] as const),
};
