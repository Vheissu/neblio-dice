const HOUSE_EDGE = 0.05;
const MIN_BET = 1;
const MAX_BET = 10;

import seedrandom from 'seedrandom';
import BigNumber from 'bignumber.js';
import jwt from 'jsonwebtoken';
import { JsonRpc } from './rpc-client';

const rpcClient = new JsonRpc(process.env.rpchost, process.env.rpcuser, process.env.rpcpass);

export const generateAddress = async(label: string) => {
    try {
        return (await rpcClient.request('getnewaddress', [label])).result;
    } catch (e) {
        return null;
    }
}

export const verifyToken = async (token, secret) => {
    return new Promise((resolve, reject) => {
      if (!token) {
        return null;
      }
  
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return reject(err);
        }
  
        return resolve(decoded);
      });
    });
  };

// Random Number Generator
export const rng = (seed: string) => {
    const random = seedrandom(`${seed}`).double();
    const randomRoll = Math.floor(random * 100) + 1;

    return randomRoll;
};

export const roller = (guess: number, amount: string, blockHash: any) => {
    // Bet amount of NEBL is valid
    if (parseFloat(amount) >= MIN_BET && parseFloat(amount) <= MAX_BET) {
        // Guess (user roll) is valid
        if ( (guess >= 2 && guess <= 96) ) {
            if (blockHash) {
                // Roll a random value
                const random = rng(blockHash);

                // Calculate the multiplier percentage
                const multiplier = new BigNumber(1).minus(HOUSE_EDGE).multipliedBy(100).dividedBy(guess);

                // Calculate the number of tokens won
                const tokensWon = new BigNumber(amount).multipliedBy(multiplier).toFixed(8, BigNumber.ROUND_DOWN);

                if ( guess > random ) {
                    // User wins
                } else {
                    // User loses
                }
            }
        }
    }
};