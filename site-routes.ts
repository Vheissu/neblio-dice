import { JsonRpc } from './rpc-client';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAddress } from './helpers';

export class SiteRoutes {
    public router = express.Router();
    public rpcClient: JsonRpc;

    constructor(rpcClient: JsonRpc) {
        this.rpcClient = rpcClient;

        this.router.get('/', (request: express.Request, response: express.Response) => {
            return response.status(200).send(`Roll the dice.`)
        });

        this.router.post(`/signup`, this.signup);
        this.router.post(`/roll`, this.roll);
        this.router.post(`/login`, this.login);
        this.router.post(`/logout`, this.logout);
        this.router.post(`/deposit`, this.deposit);
        this.router.post(`/withdraw`, this.withdraw);
        this.router.post(`/verify`, this.verify);
        this.router.post(`/bets`, this.bets);
    }

    public async roll (request: express.Request, response: express.Response) {

    }

    public async signup (request: express.Request, response: express.Response) {
        const username = request.body.username;

        const user = await request.app.locals.db.collection('users').findOne({username});

        if (user) {
            return response.status(400).send('Username or password invalid');
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(request.body.password, salt);

        const userObject = {
            username,
            password: hashPassword,
            signup_date: new Date()
        };

        const result = await request.app.locals.db.collection('users').insertOne(userObject);

        response.json(result.ops[0]);
    }

    public async login (request: express.Request, response: express.Response) {
        const username = request.body.username;

        const user = await request.app.locals.db.collection('users').findOne({username});

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

        return response.status(200).send(token);
    }

    public async logout (request: express.Request, response: express.Response) {

    }

    public async deposit (request: express.Request, response: express.Response) {
        const user = await request.app.locals.db.collection('users').findOne({username: request.body.username});

        if ( user ) {
            const deposits = await request.app.locals.db.collection('deposits');

            const label = `${request.body.username}-${Date.now()}`;

            const depositModel = {
                createdAt: new Date(),
                username: request.body.username,
                amount: request.body.amount,
                address: generateAddress(label),
                status: 'new'
            };

            const row = await deposits.insertOne(depositModel);
        }
    }

    public async withdraw (request: express.Request, response: express.Response) {
        // Get balance and 2 confirmations
        const rpcResponse = await this.rpcClient.request('getbalance', [request.params.address, 2]);
        const balance = rpcResponse.result;

        console.log(balance);
    }

    public async verify (request: express.Request, response: express.Response) {

    }

    public async bets (request: express.Request, response: express.Response) {

    }
}