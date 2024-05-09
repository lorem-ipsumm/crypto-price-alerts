require("dotenv").config();
import axios from "axios";
const fs = require("fs");
import { Client, Intents } from "discord.js";
import { ethers } from "ethers";
import { PRICE_TYPE } from "./interface";

// login to discord
let discord:any;
let discordReady = false;

// web3 provider and wallet
export let provider: ethers.providers.BaseProvider | null = null;
export let wallet: ethers.Wallet | null = null;

export const initWeb3 = async () => {
  // create web3 provider
  const web3Provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL
  );
  // create web3 wallet
  const web3Wallet = null;
  
  // update global variables
  provider = web3Provider;
  wallet = web3Wallet;
}

// log output and error message in a discord server
export function discordLog(message: string) {
  // inner send message method
  const sendMessage = async () => {
    try {
      const channel = discord.channels.cache.get(process.env.DISCORD_CHANNEL);
      if (channel) {
        await channel.send("```" + message + "```");
      }
    } catch (e) {
      console.log(e);
    }
  }
  const hasEnv = process.env.DISCORD_KEY && process.env.DISCORD_CHANNEL;
  // initiate discord if needed
  if (!discordReady && hasEnv) {
    discord = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    discord.login(process.env.DISCORD_KEY);
    discord.on("ready", () => {
      discordReady = true;
      sendMessage();
    })
  } else if (!hasEnv) {
    console.log("Missing discord env variables");
  } else {
    sendMessage();
  }
}

// sleep method
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// fix network names if needed
export const getNetwork = (network: string) => {
  if (network === "ethereum") return "eth";
  else if (network === "binance") return "bsc";
  else if (network === "avalanche") return "avax";
  else return network;
}

// fetch the current price of a token from GeckoTerminal
export const fetchTokenPrice = async (
  poolAddress: string,
  network: string = "eth",
  priceType: PRICE_TYPE
):Promise<number> => {
  try {
    const url = new URL(`https://api.geckoterminal.com/api/v2/networks/${network}/pools/${poolAddress.toLowerCase()}`);
    const req = await axios.get(url.toString());
    const price = req.data.data.attributes[priceType];
    return price;
  } catch (e) {
    console.log(e);
    return -1;
  }
}

// fetch historical price data for a token from GeckoTerminal
export const fetchTokenHistoricalPrice = async (
  poolAddress: string,
  network: string = "eth",
  interval: string = "hour",
  aggregate: number = 1,
  limit: number = 1000
):Promise<number[][]> => {
  try {
    const url = new URL(`https://api.geckoterminal.com/api/v2/networks/${network}/pools/${poolAddress.toLowerCase()}/ohlcv/${interval}`);
    url.searchParams.append("aggregate", aggregate.toString());
    url.searchParams.append("limit", limit.toString());
    const req = await axios.get(url.toString());
    const priceData = req.data.data.attributes.ohlcv_list;
    return priceData;
  } catch (e) {
    console.log(e);
    return [];
  }
}

// save an object to file
export async function saveObject (fileName: string, data: Object, dir?: string) {
  try {
    // save/load file directory 
    const path = `./${dir ? dir : 'output'}/${fileName}`;
    // save new tokens object
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(err);
    console.log("saving error")
  }
}

export const getAveragePrice = async (
  pool: string,
  network: string,
  interval: string,
  aggregate: number,
  limit: number
) => {
  // only look at dates from the last week
  const date = new Date();
  const weekAgo = date.setDate(date.getDate() - 7);
  const priceData = await fetchTokenHistoricalPrice(
    pool,
    network,
    interval,
    aggregate,
    limit
  );

  // filter out dates before the last week
  const filteredPriceData = priceData.filter((priceData) => {
    return priceData[0] > new Date(weekAgo).getTime() / 1000;
  });

  // calculate the average price
  let sum = 0;
  for (const priceData of filteredPriceData) {
    sum += priceData[4];
  }
  const averagePrice = sum / filteredPriceData.length;
  return averagePrice;
}

// load an object from file
export async function loadObject (fileName: string) {
  try {
    // read data from file
    const path = `./output/${fileName}`;
    const data = fs.readFileSync(path, {encoding: 'utf8'});
    // return JSON 
    return(JSON.parse(data));
  } catch (err) {
    console.log("loading error");
    console.log(err);
    return([]);
  }
}

// aggregator token format
// this is what defillama expects for the fromToken and toToken fields
export interface AGG_TOKEN {
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

export const aggTokens: {
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