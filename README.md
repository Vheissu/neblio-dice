# neblio-api
A Node.js wrapper API for interacting with a Neblio wallet/daemon and safely exposing RPC calls as endpoints.

## What is this?

If you are wanting to build an app on Neblio, you'll get to a point where you'll need to work with a daemon or wallet, making calls to it and interacting with the blockchain itself. Neblio provide some API endpoints you can already use, this package is for low-level blockchain calls.

## Requirements

All you need is Node.js installed on your server, a Neblio wallet/daemon that is running and love.

To run this in production as a proper service based app, this api comes with support for pm2 out of the box. Make sure you install it globally using `npm install pm2 -g`

## Installation & Setup

Pull this repository down to where you want it to exist on your server. Configure the required environment variables (particularly RPC user and password values) and then enjoy.

A sample env file is provided, you can rename `.env.sample` to `.env` and change the values accordingly. In a production application, you would never use the `.env` file this is only for testing. These environment variables should be populated elsewhere.

## Running it

While PM2 is recommended for deployed environments, you can run the app locally using `npx ts-node api.ts` which is one of the easiest ways to run it in a development/testing setting. PM2 is great for deploying to a server as it handles service creation and process management for you.

The API is available by default on port 3000. The port can be changed by specifying a `port` environment variable value (see `.env.sample`)
## Supported Endpoints

- / - Returns a default message to show you API is working
- /price - Returns the current fiat price for Neblio
- /convert/:amount - Converts the provided fiat amount into NEBL

- /api/getlatestblock: returns the latest block height
- /api/getblockbynumber/:blockHeight - Gets a block based on the supplied block height value
- /api/getblockhash/:blockHeight - Gets the hash of a blog based on supplied block height value
- /api/getblock/:hash - Gets a block by its block hash value
- /api/getrawtransaction/:txid - Gets a raw transaction based on supplied transaction id
- /api/getrawmempool - Gets the raw mempool (unconfirmed blocks)
- /api/getbalance - Gets the wallet token balance (for example, http://localhost:3000/neblio/getbalance)
- /api/getntp1balance/identifier - Gets the NTP1 token balance for a token name or tokenId (for example, http://localhost:3000/nebliapio/getntp1balance/db)

## Support my work

All NEBL donations/tips are appreciated: NevXzxMMFxf12vvKhWQuzkgKNiZHQzf8LH