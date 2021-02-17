import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import QRCode from 'qrcode';

export class SiteRoutes {
    public router = express.Router();

    constructor() {
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

        this.router.get(`/generate-qr/:text`, this.generateQrCode);
    }

    public generateQrCode = async (request: express.Request, response: express.Response) => {
        const text = request.params.text;

        const filename = 'qr/' + crypto.createHash('sha1').update(decodeURIComponent(text)).digest('hex') + '.png';
    }
}