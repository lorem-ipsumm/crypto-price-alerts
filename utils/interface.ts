export type NETWORKS =
  | "eth"
  | "arbitrum"
  | "bsc"
  | "avax"
  | "polygon_pos"
  | "optimism"
  | "fantom"
  | "base"
  | "solana"
  | "ton"
  // add more networks here

export interface ALERT_DATA {
  title: string;
  poolAddress: string;
  network: NETWORKS;
  targetPrice: number;
  priceType: PRICE_TYPE;
  alertType: "above" | "below";
  alertCount: number,
}

export enum PRICE_TYPE {
  BASE_TOKEN_PRICE_USD = "base_token_price_usd",
  BASE_TOKEN_PRICE_NATIVE_CURRENCY = "base_token_price_native_currency",
  QUOTE_TOKEN_PRICE_USD = "quote_token_price_usd",
  QUOTE_TOKEN_PRICE_NATIVE_CURRENCY = "quote_token_price_native_currency",
  BASE_TOKEN_PRICE_QUOTE_TOKEN = "base_token_price_quote_token",
  QUOTE_TOKEN_PRICE_BASE_TOKEN = "quote_token_price_base_token",
}