require("dotenv").config();
import { ethers } from "ethers";
import { ALERT_DATA } from "../utils/interface";
import { AGG_TOKEN, aggTokens, wallet } from "../utils/utils";
import { getProvider, getWallet } from "./ethersHelper";

export const getQuoteData = async (
  fromToken: AGG_TOKEN,
  toToken: AGG_TOKEN,
  rawAmountIn: string | number,
  network: string,
) => {

  try {

    const provider = getProvider();
    const wallet = getWallet();

    // convert from amount from string to BigNumber
    const fromAmount = ethers.utils.parseUnits(rawAmountIn.toString(), fromToken.decimals);

    // construct request url
    const url = new URL("https://swap-api.defillama.com/dexAggregatorQuote");
    url.searchParams.append("protocol", "ParaSwap");
    url.searchParams.append("chain", network);
    url.searchParams.append("from", fromToken.address);
    url.searchParams.append("to", toToken.address);
    url.searchParams.append("amount", fromAmount.toString());
    url.searchParams.append("api_key", process.env.DEFILLAMA_API_KEY || "");

    // use ethers to calculate gasPriceData:
    // (gasPrice, lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas)
    const gasPriceData: any = await provider.getFeeData();

    // construct request body
    const body = {
      amount: rawAmountIn.toString(),
      amountOut: "0",
      fromToken: fromToken,
      gasPriceData: {
        formatted: {
          gasPrice: gasPriceData.gasPrice.toString(),
          maxFeePerGas: gasPriceData.maxFeePerGas.toString(),
          maxPriorityFeePerGas: gasPriceData.maxPriorityFeePerGas.toString(),
        },
        ...gasPriceData,
      },
      isPrivacyEnabled: true,
      slippage: "0.5",
      toToken: toToken,
      userAddress: wallet.address,
    };

    // send request
    const data = await fetch(url.toString(), {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.8",
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        Referer: "https://swap.defillama.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: JSON.stringify(body),
      method: "POST",
    });

    // get the request response
    let res = await data.json();

    return res.rawQuote;

  } catch (e) {
    console.log(e);
    return null;
  }

}

export const executeTransaction = async (txData: {
  to: string,
  value: string,
  data: string,
  gasPrice: string,
  chainId: number,
  gasLimit: string
}) => {
  try {
    const response = await wallet?.sendTransaction(txData);
    const receipt = await response?.wait();
    return receipt;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const executeTrade = async (alertData: ALERT_DATA) => {

  try {

    // destructure alert data
    const { network, alertType } = alertData;

    let fromToken;
    let toToken;

    // use alertType and currentPrice to determine if we should buy or sell
    if (alertType === "above") {
      // selling
      fromToken = aggTokens["jUSDC"];
      toToken = aggTokens["USDC.e"];
    } else {
      // buying
      fromToken = aggTokens["USDC.e"];
      toToken = aggTokens["jUSDC"];
    }

    // setup input amount
    const rawAmountIn = "500";

    // get quote data
    const tx = await getQuoteData(
      fromToken,
      toToken,
      rawAmountIn,
      network
    );

    // construct transaction data
    const txData = {
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasPrice: tx.gasPrice,
      chainId: tx.chainId,
      gasLimit: tx.gas,
    };

    // execute transaction
    const receipt = await executeTransaction(txData);
    console.log(receipt);
    return "";

  } catch (e) {
    console.log(e);
    return null;
  }

};