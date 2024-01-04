import { ALERT_DATA } from "../utils/interface";
import { discordLog, fetchTokenPrice, loadObject, saveObject } from "../utils/utils"

export const newAlert = async (
  tokenSymbol: string,
  poolAddress: string,
  network: string,
  price: number,
  alertType: "above" | "below" = "above"
):Promise<ALERT_DATA> => {
  // load alerts file
  let alerts = await loadObject("alerts.json") || {};
  // create a title for the alert using the token symbol, alert type, and target price
  const title = `${tokenSymbol}-${alertType}-${price}`;
  // save the alert data in a file with the title as the name
  const data:ALERT_DATA = {
    title: title,
    poolAddress: poolAddress,
    network: network,
    targetPrice: price,
    alertType: alertType,
  };
  // update the alerts object
  alerts[title] = data;
  // save the alert data
  saveObject("alerts.json", alerts);
  return data;
}

export const deleteAlert = async (title: string) => {
  // load alerts file
  let alerts = await loadObject("alerts.json") || {};
  // delete the alert
  delete alerts[title];
  // save the alerts file
  saveObject("alerts.json", alerts);
}

export const checkAlerts = async (deleteAlerts?: boolean) => {
  // load all alerts
  const _alerts = await loadObject("alerts.json");
  const alerts:ALERT_DATA[] = Object.values(_alerts);
  // loop through alerts
  for (const alert of alerts) {
    // load the current price for the token
    const price = Number(await fetchTokenPrice(
      alert.poolAddress, 
      alert.network
    ));
    if (price === -1) return;
    console.log(`${alert.title} price: ${price}`);
    let message;
    if (alert.alertType === "above" && price > alert.targetPrice) {
      // alert the user
      message = (`${alert.title} is above ${alert.targetPrice}!`);
    } else if (alert.alertType === "below" && price < alert.targetPrice) {
      // alert the user
      message = (`${alert.title} is below ${alert.targetPrice}!`);
    }
    if (message)  {
      discordLog(message);
      console.log(alert);
      console.log(price);
      message += `\nAddress: ${alert.poolAddress}\nNetwork: ${alert.network}\nPrice: ${price}`;
      // delete the alert if requested
      if (deleteAlerts) deleteAlert(alert.title);
    }
  }
}