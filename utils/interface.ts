export type NETWORKS =
  | "eth"
  | "arbitrum"
  | "bsc"
  | "avax"
  | "polygon_pos"
  | "optimism"
  | "fantom"
  | "base"
  | "solana";
// add more networks here

export type AGGREGATOR =
  | "1inch"
  | "Matcha/0x"
  | "OpenOcean"
  | "KyberSwap"
  | "ParaSwap";

export type PRICE_TYPE = 
  | "base_token_price_usd"
  | "base_token_price_quote_token"
  | "quote_token_price_usd"
  | "quote_token_price_base_token"
  | "base_token_price_quote_token";

export interface ALERT_DATA {
  title: string;
  poolAddress: string;
  tokenAddress: string;
  network: NETWORKS;
  targetPrice: number;
  alertType: "above" | "below";
  priceType: PRICE_TYPE, 
  alertCount: number;
}
