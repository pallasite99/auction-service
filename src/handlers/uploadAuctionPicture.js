import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/uploadPicturetoS3';

export async function uploadAuctionPicture(event) {
    // do not change path to Path here, just don't :)
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    try{
        const uploadToS3Result = await uploadPictureToS3(auction.id + '.jpg', buffer);
        console.log(uploadToS3Result);
    }catch(error) {
        console.error(error);
        throw new createHttpError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({}),
    };
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler());

