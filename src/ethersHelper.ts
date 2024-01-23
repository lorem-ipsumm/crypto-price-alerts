import { ethers } from "ethers";

// web3 provider and wallet vars
let provider: ethers.providers.BaseProvider | null = null;
let wallet: ethers.Wallet | null = null;

// initialize web3 provider and wallet
export const initWeb3 = async () => {
  // create web3 provider
  const web3Provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL
  );
  // create web3 wallet
  const web3Wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY as string,
    web3Provider
  );
  // update global variables
  provider = web3Provider;
  wallet = web3Wallet;
}

// get web3 provider 
export const getProvider = () => {
  if (!provider) initWeb3();
  return provider as ethers.providers.BaseProvider;
}

// get web3 wallet
export const getWallet = () => {
  if (!wallet) initWeb3();
  return wallet as ethers.Wallet;
}

