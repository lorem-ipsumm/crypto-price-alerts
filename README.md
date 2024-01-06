# GeckoTerminal Price Alerts
This repo allows you to setup custom price alerts for over 1000 tokens across hundreds of DEXs using the GeckoTerminal API. At the moment this is pretty bare-bones and using it isn't completely streamlined.

## Setup
- Run `npm i` to install the project dependencies
- If you have a Discord key and channel ID that you want to send the notifications copy the `.env.example` file, update the example variables and rename it to `.env`.

## Creating Alerts 
Alerts can be created in the `main.ts` file inside of the `createNewMethod()`. Replace the calls to `newAlert()` with the data for tokens/chains you want to monitor. In the `main()` method make sure the `createNewAlert()` method call is uncommented. The parameters are as follows:
- `tokenSymbol`: The symbol for the token you want to monitor. This is purely for naming the alert and doesn't need to match the token data. 
- `poolAddress`: The address of the pool that contains the token you want to monitor.
- `network`: The name of the network that contains the pool and asset you want to monitor. 
	- This name must match what the GeckoTerminal API expects. I've already included a list of 9 possible networks. Feel free to add any additional ones
- `price`: The price that will trigger the alert.
- `alertType`: The type of alert you want this to be. Must be "above" or "below".
	- "above" for when you want to be alerted when the asset price crosses above `price`.
	- "below" for when you want to be alerted when the asset price crosses below `price`

## Running the Bot
To run the bot make sure the `run()` method in the `main()` method is uncommented. This will start the bot and it should run indefinitely and periodically check the prices of the assets that you've set alerts for. The `checkAlerts()` method takes in a boolean variable that allows you to set whether or not you want the alert to be deleted after it's been triggered. Setting this to true will prevent the alert from constantly being triggered once the condition is met for a given alert.

## Alert Storage
All alerts are stored in a JSON file inside of `output/alert.json`. You can modify the properties for an alert by modifying this file.

## Disclaimer
As I stated earlier, this repo is pretty bare-bones and doesn't include any complex functionality, but is simple enough for anyone to add more complexity and features.