import { ethers } from "ethers";
import { aggTokens, sleep } from "../utils/utils";
import { checkAlerts, newAlert } from "./alert";
import { getQuoteData } from "./execute";

const createNewAlert = async () => {
  newAlert(
    "plsARB", 
    "0x47a52b2bee1a0cc9a34bb9ee34c357c054112c3e", 
    "0x7a5D193fE4ED9098F7EAdC99797087C96b002907",
    "arbitrum", 
    0.992, 
    "below",
    "base_token_price_quote_token"
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
  // await discordLog(`Starting ${new Date().toLocaleString()}`);
  // await initWeb3();
  // await createNewAlert();
  await run();
}

main();
