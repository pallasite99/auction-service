import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/uploadPicturetoS3';
import { setAuctionPicture } from '../lib/setAuctionPicture';

export async function uploadAuctionPicture(event) {
    // do not change path to Path here, just don't :)
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);
    const { email } = event.requestContext.authorizer;

    // validate auction ownership
    if (email !== auction.seller){
        throw new createHttpError.Forbidden(`You cannot upload images if you are not the seller`);
    }

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    let updatedAuction;

    try{
        const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
        // set this in dynamoDB table
        updatedAuction = await setAuctionPicture(auction.id, pictureUrl);
    }catch(error) {
        console.error(error);
        throw new createHttpError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler());

