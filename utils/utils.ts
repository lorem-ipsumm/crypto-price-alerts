require("dotenv").config();
import axios from "axios";
const fs = require("fs");
import { Client, Intents } from "discord.js";
import { PRICE_TYPE } from "./interface";

// login to discord
let discord: any;
let discordReady = false;

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
  _poolAddress: string,
  network: string = "eth",
  priceType: PRICE_TYPE = PRICE_TYPE.BASE_TOKEN_PRICE_USD
): Promise<number> => {
  try {
    // networks where the pool address isn't exclusively checksummed
    const specialNetworks = ["solana", "ton"];
    const poolAddress = specialNetworks.includes(network) ? _poolAddress : _poolAddress.toLowerCase();
    const url = new URL(`https://api.geckoterminal.com/api/v2/networks/${network}/pools/${poolAddress}`);
    const req = await axios.get(url.toString());
    const price = req.data.data.attributes[priceType];
    return price;
  } catch (e) {
    console.log(e);
    return -1;
  }
}

// fetch historical price data for a token from GeckoTerminal
const fetchPriceData = async (
  poolAddress: string,
  network: string = "eth",
  interval: string = "hour",
  aggregate: number = 1,
  limit: number = 1000
): Promise<any[]> => {
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
export async function saveObject(fileName: string, data: Object, dir?: string) {
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

// load an object from file
export async function loadObject(fileName: string) {
  try {
    // read data from file
    const path = `./output/${fileName}`;
    const data = fs.readFileSync(path, { encoding: 'utf8' });
    // return JSON 
    return (JSON.parse(data));
  } catch (err) {
    console.log("loading error");
    console.log(err);
    return ([]);
  }
}