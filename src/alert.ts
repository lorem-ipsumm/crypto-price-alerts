import { ALERT_DATA, NETWORKS } from "../utils/interface";
import { discordLog, fetchTokenHistoricalPrice, fetchTokenPrice, loadObject, saveObject } from "../utils/utils"

export const newAlert = async (
  tokenSymbol: string,
  poolAddress: string,
  network: NETWORKS,
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
    alertCount: 0
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

export const checkAlerts = async (
  // should the alert be deleted after it is triggered (true for yes; false for no)
  deleteAlerts?: boolean
) => {
  // load all alerts
  const _alerts = await loadObject("alerts.json");
  const alerts:ALERT_DATA[] = Object.values(_alerts);
  // loop through alerts
  for (const alertData of alerts) {
    let alert = {
      ...alertData
    };
    // load the current price for the token
    const price = Number(await fetchTokenPrice(
      alert.poolAddress, 
      alert.network
    ));
    if (price === -1) return;
    const timestamp = new Date().toLocaleString();
    console.log(`${timestamp}: ${alert.title} price: ${price.toFixed(3)}`);
    // setup message data object
    let messageData = {
      title: "",
      targetPrice: 0,
      direction: "",
      set: false
    }
    if (alert.alertType === "above" && price > alert.targetPrice) {
      // alert the user
      messageData.set = true;
      messageData.direction = "above";
    } else if (alert.alertType === "below" && price < alert.targetPrice) {
      // alert the user
      messageData.set = true;
      messageData.direction = "below";
    }
    let message = (`${alert.title} \n${messageData.direction}  \nCurrent Price: ${price.toFixed(3)}`);
    // if there is no message, continue
    const alertCount = alert.alertCount;
    const maxAlertCount = 2;
    if (messageData.set && alertCount < maxAlertCount)  {
      discordLog(message);
      // update the alert count
      alert.alertCount++;
      // save the alert data
      // delete the alert if requested
      if (deleteAlerts) deleteAlert(alert.title);
    } else if(!messageData.set) {
      // set the alert count to 0 if the alert is not triggered
      alert.alertCount = 0;
    }
    _alerts[alert.title] = alert;
    saveObject("alerts.json", _alerts);
  }
}