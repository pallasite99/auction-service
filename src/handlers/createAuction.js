// event  -> actual data
// context -> metadata, can be used by middleware layer
async function createAuction(event, context) {
  // this is the structure of response expected by AWS Lambda
  return {
    statusCode: 200,
    // response body always needs to be stringified else it will return errors!
    body: JSON.stringify({ event, context }), //response
  };
}

export const handler = createAuction;


