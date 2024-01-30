import { ethers } from "ethers";
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

const testRoute = async () => {
  const inputToken = aggTokens["USDC.e"];
  const outputToken = aggTokens["jUSDC"];

  const quoteData = await getQuoteData(
    inputToken,
    outputToken,
    "1000",
    "arbitrum",
    "ParaSwap"
  );

  const rawAmtOut = quoteData.amountReturned;
  const amtOut = ethers.utils.formatUnits(rawAmtOut, outputToken.decimals);
  console.log(amtOut);
}

const main = async () => {
  await discordLog(`Starting ${new Date().toLocaleString()}`);
  await initWeb3();
  // await createNewAlert();
  await run();
}

main();
