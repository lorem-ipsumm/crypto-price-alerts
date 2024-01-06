import { discordLog, sleep } from "../utils/utils";
import { checkAlerts, newAlert } from "./alert";

const createNewAlert = async () => {
  newAlert(
    "jUSDC", 
    "0x2bcd0aac7d98697d8760fb291625829113e354e7", 
    "arbitrum", 
    1.06, 
    "below"
  );
  newAlert(
    "jUSDC", 
    "0x2bcd0aac7d98697d8760fb291625829113e354e7", 
    "arbitrum", 
    1.078, 
    "above"
  );
}

const run = async () => {
  await discordLog(`Starting ${new Date().toLocaleString()}`);
  while (true) {
    await checkAlerts(false);
    await sleep(15000);
  }
}


const main = async () => {
  // await createNewAlert();
  await run();
}

main();
