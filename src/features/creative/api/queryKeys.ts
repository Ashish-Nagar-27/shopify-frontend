export interface CreativeDateParams {
  startDate?: string;
  endDate?: string;
}

export const creativeKeys = {
  all: ["facebookCreativeData"] as const,
  facebookCreativeData: (params?: CreativeDateParams) =>
    params ? ([...creativeKeys.all, params] as const) : creativeKeys.all,
};
