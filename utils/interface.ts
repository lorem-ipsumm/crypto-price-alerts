export interface ALERT_DATA {
  title: string,
  poolAddress: string,
  network: string,
  targetPrice: number,
  alertType: "above" | "below"
}