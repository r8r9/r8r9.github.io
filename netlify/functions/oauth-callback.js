// netlify/functions/oauth-callback.js
exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  const state = event.queryStringParameters.state;
  // Handle the code and state, e.g., exchange the code for a token
  return {
    statusCode: 200,
    body: "OAuth2 callback received!",
  };
};