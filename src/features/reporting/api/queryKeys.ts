export interface ReportingTableQueryParams {
  attribute?: string;
  startDate?: string;
  endDate?: string;
  traffic?: string;
  click_type?: string;
  window?: string;
}

export interface ReportingTableSaleQueryParams {
  adid?: string;
  startDate?: string;
  endDate?: string;
  channel?: string;
  attribute?: string;
  islead?: boolean;
  click_type?: string;
  window?: string;
}

export interface ReportingDateParams {
  startDate?: string;
  endDate?: string;
}

export const reportingKeys = {
  all: ["reporting"] as const,

  table: (params?: ReportingTableQueryParams) =>
    params ? (["reportingTable", params] as const) : (["reportingTable"] as const),

  tableSaleData: (params?: ReportingTableSaleQueryParams) =>
    params
      ? (["reportingTableSaleData", params] as const)
      : (["reportingTableSaleData"] as const),

  tableSaleJourney: (trackid?: string) =>
    trackid
      ? (["reportingTableSaleJourney", trackid] as const)
      : (["reportingTableSaleJourney"] as const),

  customerProfile: (trackid?: string) =>
    trackid
      ? (["reportingCustomerProfile", trackid] as const)
      : (["reportingCustomerProfile"] as const),

  adsAccounts: () => ["reportingAdsAccounts"] as const,

  source: () => ["reportingSource"] as const,

  graphSalesMetrics: (params?: ReportingDateParams) =>
    params
      ? (["reportingGraphSalesMetrics", params] as const)
      : (["reportingGraphSalesMetrics"] as const),

  customizedColumns: (view?: string) =>
    view
      ? (["reportingCustomizedColumns", view] as const)
      : (["reportingCustomizedColumns"] as const),
};
