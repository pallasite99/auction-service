import AWS from 'aws-sdk';
// middleware
import commonMiddleware from '../lib/commonMiddleware';
// import validator from '@middy/validator';
// import placeBidSchema from '../lib/schemas/placeBidSchema';
import createError from 'http-errors';
import { getAuctionById } from './getAuction';
// global scope as static
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    let updatedAuction;
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const { email } = event.requestContext.authorizer;

    const auction = await getAuctionById(id);

    // auction status validation
    if(auction.status !== 'open') {
      throw new createError.Forbidden(`You cannot bid on a closed auction!`);
    }

    // auction bid validation
    if (amount <= auction.highestBid.amount) {
      throw new createError.Forbidden(`Your amount must be higher than ${auction.highestBid.amount}!`);
    }

    // seller identity validation
    if (email === auction.seller) {
      throw new createError.Forbidden(`Sorry, You cannot bid on your own item! Inflation kills`);
    }

    // seller bid validation
    if (email === auction.highestBid.bidder) {
      throw new createError.Forbidden(`You are already the highest bidder with: ${auction.highestBid.amount}!`);
    }

    try{
      // better way is to put all params in a separate object
      const result = await dynamoDB.update({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
            ':amount': amount,
            ':bidder': email,
        },
        ReturnValues: 'ALL_NEW',
      }).promise();

      updatedAuction = result.Attributes;
    } catch(error){
      console.log(error);
      throw new createError.InternalServerError(error);
    }

    if (!updatedAuction){
      throw new createError.NotFound(`Auction with id "${id}" does not exist!`);
    }

    return{
      statusCode: 200,
      body: JSON.stringify(updatedAuction)
    };
  }

  export const handler = commonMiddleware(placeBid);
    // does not work!
    // .use(validator({
    //   inputSchema: placeBidSchema
    // }));