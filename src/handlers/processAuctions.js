import { getEndedAuctions } from '../lib/getEndedAuctions';
import { closeAuction } from '../lib/closeAuction';
import createError from 'http-errors';

async function processAuctions(event, context){
    try {
        const auctionsToClose = await getEndedAuctions();
        // close auctions parallely instead of sequential manner using map
        const closePromise = auctionsToClose.map(auction => closeAuction(auction));
        await Promise.all(closePromise);
        return { closed: closePromise.length };
    } catch(error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

export const handler = processAuctions;