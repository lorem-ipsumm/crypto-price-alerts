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

export interface ALERT_DATA {
  title: string;
  poolAddress: string;
  network: NETWORKS;
  targetPrice: number;
  alertType: "above" | "below";
  alertCount: number
}
