import AWS from 'aws-sdk';
// middleware
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
// global scope as static
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id){
  let auction;
  // dynamoDB scan
  try{
    const result = await dynamoDB.get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id }
    }).promise();

    auction = result.Item;
  } catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction){
    throw new createError.NotFound(`Auction with id "${id}" does not exist!`);
  }

  return auction;
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  const auction = await getAuctionById(id);
  return{
    statusCode: 200,
    body: JSON.stringify(auction)
  };
}

export const handler = commonMiddleware(getAuction);