const rp = require('request-promise');
const asyncWrapper = require('../utils/asyncWrapper');
const returnResponse = require('../utils/returnResponse');
const oauth = require('../OAuth/oauth');

const invoke = async event => {
  console.log(event);

  const { cacheCode, oauthToken, oauthTokenSecret } = JSON.parse(event.body);

  const data = {
    url: 'https://opencaching.pl/okapi/services/caches/geocache',
    method: 'GET',
    data: {
      cache_code: cacheCode,
      oauth_consumer_key: process.env.CONSUMER_KEY,
      fields: 'code|name|location|url|is_found'
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
      qs: oauth.authorize(data, token),
      json: true
    }
  ));

  return !error ? returnResponse(201, result) : returnResponse(error.statusCode, error.body)
}

exports.invoke = invoke;