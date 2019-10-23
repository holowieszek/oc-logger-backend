const oauth = require('./oauth');
const rp = require('request-promise');
const asyncWrapper = require('../utils/asyncWrapper');
const returnResponse = require('../utils/returnResponse');

const invoke = async event => {
  console.log(event);

  const { oauthVerifier, oauthToken, oauthTokenSecret } = JSON.parse(event.body)

  const data = {
    url: 'https://opencaching.pl/okapi/services/oauth/access_token',
    method: 'POST',
    data: {
      oauth_verifier: oauthVerifier,
      oauth_token: oauthToken,
    }
  }

  const token = {
    key: oauthToken,
    secret: oauthTokenSecret
  }

  const { error, result } = await asyncWrapper(rp(
    {
      url: data.url,
      method: data.method,
      form: oauth.authorize(data, token)
    }
  ));

  return !error ? returnResponse(200, result) : returnResponse(error.statusCode, error);
}

exports.invoke = invoke;