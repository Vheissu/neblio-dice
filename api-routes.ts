import { JsonRpc } from './rpc-client';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

export class ApiRoutes {
    public path = '/api';
    public router = express.Router();
    public rpcClient: JsonRpc;

    constructor(rpcClient: JsonRpc) {
        this.rpcClient = rpcClient;

        this.router.get(`${this.path}/listreceivedbyaddress`, this.listReceivedByAddress);
        this.router.get(`${this.path}/getlatestblock`, this.getLatestBlock);
        this.router.get(`${this.path}/getblockbynumber/:blocknumber`, this.getBlockByNumber);
        this.router.get(`${this.path}/getblockhash/:blocknumber`, this.getBlockHash);
        this.router.get(`${this.path}/getblock/:hash`, this.getBlock);
        this.router.get(`${this.path}/getrawtransaction/:txid`, this.getRawTransaction);
        this.router.get(`${this.path}/getrawmempool`, this.getRawMemPool);
        this.router.get(`${this.path}/getbalance`, this.getBalance);
        this.router.get(`${this.path}/getreceivedbyaddress/:address`, this.getReceivedByAddress);
        this.router.get(`${this.path}/signmessage/:address/:message`, this.signMessage);
        this.router.get(`${this.path}/verifymessage/:address/:signature/:message`, this.signMessage);
        this.router.get(`${this.path}/getntp1balance/:identifier`, this.getNtp1Balance);
        //this.router.get(`${this.path}/getnewaddress/:label`, this.getNewAddress);

        this.router.get(`${this.path}/request/:amount/:memo/:seller/:buyer`, this.requestPayment);
    }

    public requestPayment = async (request: express.Request, response: express.Response) => {
        // Each Neblio is equal to 100 million nibbles
        // One Nibble represents 0.00000001 NEBL (equal to Neblios eight decimal)
        const nibbles = Math.floor((request.params.amount as any / globalThis.price) * 100000000);

        // The amount of Neblio required to complete the transaction in fiat price
        const nebl = nibbles / 100000000;

        const label = request.params.buyer;
        const address = await (await this.rpcClient.request('getnewaddress', [label])).result;

        const transactionData = {
            timestamp: Date.now(),
            expires: Date.now() + (15 * 60000), // 15 minutes expiry
            status: 'new',
            amount: request.params.amount,
            rate: globalThis.price,
            nebl_ask: nebl,
            memo: request.params.memo,
            seller: request.params.seller,
            buyer: request.params.buyer,
            address
        };

        return response.status(200).send(address);
    }

    public listReceivedByAddress = async (request: express.Request, response: express.Response) => {
        const rpcResponse = await this.rpcClient.request('listreceivedbyaddress', [0, true]);

        return response.json(rpcResponse.result);
    }

    public getLatestBlock = async (request: express.Request, response: express.Response) => {
        const rpcResponse = await this.rpcClient.request('getblockcount');

        return response.json(rpcResponse.result);
    }

    public getBlockByNumber = async (request: express.Request, response: express.Response) => {
        const blockNumber = request.params.blocknumber;

        const rpcResponse = await this.rpcClient.request('getblockbynumber', [parseInt(blockNumber), true]);

        return response.json(rpcResponse.result);
    }

    public getBlockHash = async (request: express.Request, response: express.Response) => {
        const blockNumber = request.params.blocknumber;

        const rpcResponse = await this.rpcClient.request('getblockhash', [parseInt(blockNumber)]);

        return response.json(rpcResponse.result);
    }

    public getBlock = async (request: express.Request, response: express.Response) => {
        const blockHash = request.params.hash;

        const rpcResponse = await this.rpcClient.request('getblock', [blockHash, true, true]);

        return response.json(rpcResponse.result);
    }

    public getRawTransaction = async (request: express.Request, response: express.Response) => {
        const txid = request.params.txid;

        const rpcResponse = await this.rpcClient.request('getrawtransaction', [txid, true]);

        return response.json(rpcResponse.result);
    }

    public getRawMemPool = async (request: express.Request, response: express.Response) => {
        const rpcResponse = await this.rpcClient.request('getrawmempool');

        return response.json(rpcResponse.result);
    }

    // public getNewAddress = async (request: express.Request, response: express.Response) => {
    //     const label = request.params.label;

    //     const rpcResponse = await this.rpcClient.request('getnewaddress', [label]);

    //     return response.json(rpcResponse.result);
    // }

    public getBalance = async (request: express.Request, response: express.Response) => {
        const rpcResponse = await this.rpcClient.request('getbalance');

        return response.json(rpcResponse.result);
    }

    public getReceivedByAddress = async (request: express.Request, response: express.Response) => {
        const rpcResponse = await this.rpcClient.request('getreceivedbyaddress', [request.params.address, 0]);

        return response.json(rpcResponse.result);
    }

    public signMessage = async (request: express.Request, response: express.Response) => {
        const rpcResponse = await this.rpcClient.request('signmessage', [request.params.address, request.params.message]);

        return response.json(rpcResponse.result);
    }

    public verifyMessage = async (request: express.Request, response: express.Response) => {
        const rpcResponse = await this.rpcClient.request('verifymessage', [request.params.address, request.params.signature, request.params.message]);

        return response.json(rpcResponse.result);
    }

    public getNtp1Balance = async (request: express.Request, response: express.Response) => {
        // tokenId or name
        const identifier = request.params.identifier;

        const rpcResponse = await this.rpcClient.request('getntp1balance', [identifier]);

        return response.json(rpcResponse.result);
    }
}