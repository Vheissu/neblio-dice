import { JsonRpc } from './rpc-client';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        const username = request.body.email;

        const user = await request.app.locals.db.findOne({username});

        if (user) {
            return response.status(400).send('Username or password invalid');
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(request.body.password, salt);

        const userObject = {
            username,
            password: hashPassword,
            signup_date: Date.now()
        };

        await request.app.locals.db.insertOne(userObject);
    }

    public roll = async (request: express.Request, response: express.Response) => {

    }

    public login = async (request: express.Request, response: express.Response) => {
        const username = request.body.email;

        const user = await request.app.locals.db.findOne({username});

        if (!user) {
            return response.status(400).send('Username or password invalid');
        }

        const compare = await bcrypt.compare(request.body.password, user.password);

        if (!compare) {
            return response.status(400).send('Username or password invalid');
        }

        const payload = {
            user_id: user._id,
            username: user.username
        };

        const token = jwt.sign(payload, process.env.token_secret);
        response.header('x-access-token', token);

        return response.status(200).send(token)
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