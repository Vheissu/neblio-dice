import { JsonRpc } from './rpc-client';
import express from 'express';

export class SiteRoutes {
    public router = express.Router();
    public rpcClient: JsonRpc;

    constructor(rpcClient: JsonRpc) {
        this.rpcClient = rpcClient;

        this.router.get('/', (request: express.Request, response: express.Response) => {
            return response.status(200).send(`Let's make some money.`)
        });

        this.router.get('/price', (request: express.Request, response: express.Response) => {
            return response.status(200).send(`${globalThis.price}`);
        });

        this.router.get('/convert/:amount', (request: express.Request, response: express.Response) => {
            // Each Neblio is equal to 100 million nibbles
            // One Nibble represents 0.00000001 NEBL (equal to Neblios eight decimal)
            const nibbles = Math.floor((request.params.amount as any / globalThis.price) * 100000000);

            // The amount of Neblio required to complete the transaction in fiat price
            const nebl = nibbles / 100000000;

            return response.status(200).send(`${nebl} NEBL`);
        });

        this.router.get(`/signup`, this.signup);
        this.router.post(`/roll`, this.roll);
        this.router.post(`/login`, this.login);
        this.router.post(`/logout`, this.logout);
        this.router.post(`/withdraw`, this.withdraw);
        this.router.post(`/verify`, this.verify);
        this.router.post(`/bets`, this.bets);
    }

    public signup = async (request: express.Request, response: express.Response) => {

    }

    public roll = async (request: express.Request, response: express.Response) => {

    }

    public login = async (request: express.Request, response: express.Response) => {

    }

    public logout = async (request: express.Request, response: express.Response) => {

    }

    public withdraw = async (request: express.Request, response: express.Response) => {
        // Get balance and 2 confirmations
        const rpcResponse = await this.rpcClient.request('getbalance', [request.params.address, 2]);
        const balance = rpcResponse.result;

        console.log(balance);
    }

    public verify = async (request: express.Request, response: express.Response) => {

    }

    public bets = async (request: express.Request, response: express.Response) => {

    }
}