require("dotenv").config();
import { ethers } from "ethers";
import { ALERT_DATA } from "../utils/interface";
import { initWeb3, provider } from "../utils/utils";

// aggregator token format
// this is what defillama expects for the fromToken and toToken fields
interface AGG_TOKEN {
  address: string;
  chainId: number;
  decimals: number;
  geckoId: string | null;
  isGeckoToken?: boolean;
  label: string;
  logoURI: string;
  logoURI2: string | null;
  name: string;
  symbol: string;
  value: string;
  volume24h: number;
}

const aggTokens: {
  [key: string]: AGG_TOKEN;
} = {
  "USDC.e": {
    address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    chainId: 42161,
    decimals: 6,
    geckoId: null,
    label: "USDC.e",
    logoURI:
      "https://token-icons.llamao.fi/icons/tokens/42161/0xff970a61a04b1ca14834a43f5de4533ebddb5cc8?h=20&w=20",
    logoURI2: null,
    name: "USD Coin (Bridged)",
    symbol: "USDC.e",
    value: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    volume24h: 0,
  },
  jUSDC: {
    address: "0xe66998533a1992ece9ea99cdf47686f4fc8458e0",
    chainId: 42161,
    decimals: 18,
    geckoId: null,
    isGeckoToken: true,
    label: "jUSDC",
    logoURI:
      "https://token-icons.llamao.fi/icons/tokens/42161/0xe66998533a1992ece9ea99cdf47686f4fc8458e0?h=20&w=20",
    logoURI2: null,
    name: "Jones USDC",
    symbol: "jUSDC",
    value: "0xe66998533a1992ece9ea99cdf47686f4fc8458e0",
    volume24h: 0,
  },
};

export const executeTrade = async (alertData: ALERT_DATA) => {

  // check if provider is initialized
  if (!provider) {
    return console.log("provider not initialized");
  }

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
  const fromAmount = ethers.utils.parseUnits(rawAmountIn, fromToken.decimals);

  // construct request url
  const url = new URL("https://swap-api.defillama.com/dexAggregatorQuote");
  url.searchParams.append("protocol", "ParaSwap");
  url.searchParams.append("chain", network);
  url.searchParams.append("from", fromToken.address);
  url.searchParams.append("to", toToken.address);
  url.searchParams.append("amount", fromAmount.toString());
  url.searchParams.append("api_key", process.env.DEFILLAMA_API_KEY || "");

  // use ethers to calculate gasPriceData (gasPrice, lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas)
  const gasPriceData: any = await provider.getFeeData();

  // construct request body
  const body = {
    amount: rawAmountIn,
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
    userAddress: "0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e",
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

  // use the rawQuote to construct a transaction
  const rawQuote = res.rawQuote;

  // construct transaction
  const tx = {
    to: rawQuote.to,
    value: rawQuote.value,
    data: rawQuote.data,
    gasPrice: rawQuote.gasPrice,
    chainId: rawQuote.chainId,
    gasLimit: rawQuote.gasLimit,
  }

  // console.log(tx);

};
