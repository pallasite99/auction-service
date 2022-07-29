import AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function setAuctionPicture(id, pictureUrl) {
    // params for update query
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set pictureUrl=:pictureUrl',
        ExpressionAttributeValues: {
            ':pictureUrl': pictureUrl,
        },
        ReturnValues: 'ALL_NEW',
    };
    // execute dynamodb update query in try catch block
    const result = await dynamodb.update(params).promise();
    //return
    return result.Attributes;
}