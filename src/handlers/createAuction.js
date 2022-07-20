import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
// middleware
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';
// global scope as static
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  // JSON parsing handled by middy
  const { title } = event.body;
  // returns current time in YYYY-MM-DDTHH:mm:ss.sssZ format
  const now = new Date();
  const auction = {
    id: uuid(),
    title,
    status: 'open',
    createdAt: now.toISOString()
  };

  try{
    await dynamoDB.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch (error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  // this is the structure of response expected by AWS Lambda
  return {
    // 201--resource created
    statusCode: 201,
    // response body always needs to be stringified else it will return errors!
    body: JSON.stringify(auction), //response
  };
}

export const handler = middy(createAuction)
.use(httpJsonBodyParser())
.use(httpEventNormalizer())
.use(httpErrorHandler());