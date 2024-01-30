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
  // add more networks here

export type AGGREGATOR =
  | "1inch"
  | "Matcha/0x"
  | "OpenOcean"
  | "KyberSwap"
  | "ParaSwap"

export interface ALERT_DATA {
  title: string;
  poolAddress: string;
  tokenAddress: string;
  network: NETWORKS;
  targetPrice: number;
  alertType: "above" | "below";
  alertCount: number
}
