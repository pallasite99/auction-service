import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
    const now = new Date();
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endingAt <= :now',
        ExpressionAttributeValues: {
            ':status': 'open',
            ':now': now.toISOString(),
        },
        // this is done because status is a reserved word
        // replace mechanism
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items;
}