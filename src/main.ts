import { aggTokens, discordLog, initWeb3, sleep } from "../utils/utils";
import { checkAlerts, newAlert } from "./alert";
import { executeTrade, getQuoteData } from "./execute";

const createNewAlert = async () => {
  newAlert(
    "jUSDC", 
    "0x2bcd0aac7d98697d8760fb291625829113e354e7", 
    "0xe66998533a1992ece9ea99cdf47686f4fc8458e0",
    "arbitrum", 
    1.06, 
    "below"
  );
  newAlert(
    "jUSDC", 
    "0x2bcd0aac7d98697d8760fb291625829113e354e7", 
    "0xe66998533a1992ece9ea99cdf47686f4fc8458e0",
    "arbitrum", 
    1.078, 
    "above"
  );
}

const run = async () => {
  while (true) {
    await checkAlerts(
      false,
      // executeTrade
    );
    await sleep(15000);
  }
}


const main = async () => {
  // await discordLog(`Starting ${new Date().toLocaleString()}`);

  await initWeb3();
  const quoteData = await getQuoteData(
    aggTokens["jUSDC"],
    aggTokens["USDC.e"],
    "1",
    "arbitrum"
  );
  const receipt = await executeTrade(quoteData);
  console.log(receipt);
  // await createNewAlert();
  // await run();
}

main();
