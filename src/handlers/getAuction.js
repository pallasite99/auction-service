import AWS from 'aws-sdk';
// middleware
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
// global scope as static
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;

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

  return{
    statusCode: 200,
    body: JSON.stringify(auction)
  };
}

export const handler = commonMiddleware(getAuction);