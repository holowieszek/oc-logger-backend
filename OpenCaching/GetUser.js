const oauth = require('../OAuth/oauth');
const rp = require('request-promise');
const asyncWrapper = require('../utils/asyncWrapper');
const returnResponse = require('../utils/returnResponse');

const invoke = async event => {
  console.log(event);

  const { oauthToken, oauthTokenSecret } = JSON.parse(event.body);

  const data = {
    url: 'https://opencaching.pl/okapi/services/users/user',
    method: 'POST',
    data: {
      fields: 'username',
      oauth_consumer_key: process.env.CONSUMER_KEY
    }
  }

  const token = {
    key: oauthToken,
    secret: oauthTokenSecret,
  }
  
  const { error, result } = await asyncWrapper(rp(
    {
      url: data.url,
      method: data.method,
      qs: oauth.authorize(data, token),
      json: true
    }
  ));
  
  console.log('error, result', error, result);
  return !error ? returnResponse(201, result) : returnResponse(error.statusCode, error.body)
}

exports.invoke = invoke;