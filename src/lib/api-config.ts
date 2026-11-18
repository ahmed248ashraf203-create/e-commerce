const configuredApiBase =
  process.env.ROUTE_API_BASE_URL ?? "https://ecommerce.routemisr.com/api";

export const ROUTE_API_BASE_URL = configuredApiBase.replace(/\/+$/, "");
export const ROUTE_API_V1_URL = `${ROUTE_API_BASE_URL}/v1`;
export const ROUTE_API_V2_URL = `${ROUTE_API_BASE_URL}/v2`;
