import { Database } from './database';
import { JsonRpc } from './rpc-client';
import { ApiRoutes } from './api-routes';
import { SiteRoutes } from './site-routes';
import fetch from 'node-fetch';
import express, { NextFunction } from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

if (!globalThis.fetch) {
	globalThis.fetch = fetch;
}

// Starting price is $2 per NEBL (until API sets the value)
globalThis.price = 2.00;

const authMiddleware = (req: Express.Request, res: Express.Response, next: NextFunction) => {
  // @ts-ignore
  const token = req.header('x-access-token');

  if (!token) {
    return res.status(401).send('Access denied!');
  }

  try {
    jwt.verify(token, process.env.token_secret, (err, decoded) => {
      if (err) {
        return res.status(400).send('Invalid token');
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } catch (err) {
    res.send('Invalid token');
  }
};

(async () => {
  try {
    const dbClient = new Database();
    const dbInstance = await dbClient.init('mongodb://localhost', 'neblio-pay');

    const app = express();
    const port = process.env.PORT || 3000;
    app.use(express.json());
    app.use(authMiddleware);

    app.locals.db = dbInstance;

    // Middleware to generate a unique ID for each request
    app.use((request: Express.Request, response: Express.Response, next: NextFunction) => {
      request['id'] = uuidv4();
      next();
    });
  
    const rpcClient = new JsonRpc(process.env.rpchost, process.env.rpcuser, process.env.rpcpass);
  
    const apiRoutes = new ApiRoutes(rpcClient);
    const siteRoutes = new SiteRoutes(rpcClient);
    
    app.use('/', siteRoutes.router);
    app.use('/', apiRoutes.router);
    
    app.listen(port, () => {
      console.log(`server is listening on ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

const getCurrentExchangeRate = async (fiat: string = 'usd') => {
  const request = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=neblio&vs_currencies=${fiat}`);
  const response = await request.json();

  const price  = response.neblio[fiat];

  globalThis.price = parseFloat(price);
}

getCurrentExchangeRate(process.env.base_currency);

// Update exchange rate price every 5 minutes
setInterval(() => getCurrentExchangeRate(process.env.base_currency), 5 * 60 * 1000);