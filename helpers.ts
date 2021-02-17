const HOUSE_EDGE = 0.05;
const MIN_BET = 1;
const MAX_BET = 10;

import seedrandom from 'seedrandom';
import BigNumber from 'bignumber.js';

// Random Number Generator
const rng = (seed: string) => {
    const random = seedrandom(`${seed}`).double();
    const randomRoll = Math.floor(random * 100) + 1;

    return randomRoll;
};

const roller = (guess: number, amount: string, latestBlock: any) => {
    
    // Bet amount of NEBL is valid
    if (parseFloat(amount) >= MIN_BET && parseFloat(amount) <= MAX_BET) {
        // Guess (user roll) is valid
        if ( (guess >= 2 && guess <= 96) ) {
            if (latestBlock && latestBlock?.txid) {
                // Roll a random value
                const random = rng(latestBlock.txid);

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