async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  // returns current time in YYYY-MM-DDTHH:mm:ss.sssZ format
  const now = new Date();
  const auction = {
    title,
    status: 'open',
    createdAt: now.toISOString()
  };
  // this is the structure of response expected by AWS Lambda
  return {
    // 201--resource created
    statusCode: 201,
    // response body always needs to be stringified else it will return errors!
    body: JSON.stringify({ auction }), //response
  };
}

export const handler = createAuction;


