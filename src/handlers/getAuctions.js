import AWS from 'aws-sdk';
// middleware
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
// global scope as static
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  const { status } = event.queryStringParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    }
  };

  // dynamoDB query
  try{
    const result = await dynamoDB.query(params).promise();

    auctions = result.Items;
  } catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return{
    statusCode: 200,
    body: JSON.stringify(auctions)
  };
}

export const handler = commonMiddleware(getAuctions);