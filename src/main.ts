import { PRICE_TYPE } from "../utils/interface";
import { discordLog, sleep } from "../utils/utils";
import { checkAlerts, newAlert } from "./alert";

const createNewAlert = async () => {
  newAlert({
    tokenSymbol: "tsTON",
    poolAddress: "EQC_OxV6MQ6csZXNk2Zu6jMrsGRI6m4YRzL2McKaPCYmNk6l",
    network: "ton",
    price: 1.0242,
    alertType: "below",
    priceType: PRICE_TYPE.BASE_TOKEN_PRICE_QUOTE_TOKEN
  });
}

const run = async () => {
  await discordLog(`Starting ${new Date().toLocaleString()}`);
  while (true) {
    await checkAlerts(false);
    await sleep(15000);
  }
}

const main = async () => {
  await run();
}

main();