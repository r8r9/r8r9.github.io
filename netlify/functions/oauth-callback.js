// netlify/functions/oauth-callback.js
const axios = require('axios');
const fs = require('fs');

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  
  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    // Exchange code for an access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://verifyoauth.netlify.app/oauth-callback',
        client_id: clientId,
        client_secret: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch user info using the access token
    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userId = userResponse.data.id;

    // Log user ID to a file
    const logFilePath = '/tmp/user_ids.txt';
    fs.appendFileSync(logFilePath, `${userId}\n`);

    return {
      statusCode: 200,
      body: "OAuth2 callback received!",
    };

  } catch (error) {
    console.error('Error during OAuth callback:', error);
    return {
      statusCode: 500,
      body: "An error occurred during the OAuth callback.",
    };
  }
};
