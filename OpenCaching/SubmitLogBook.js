const rp = require('request-promise');
const asyncWrapper = require('../utils/asyncWrapper');
const returnResponse = require('../utils/returnResponse');
const oauth = require('../OAuth/oauth');

const invoke = async event => {
  console.log(event);

  const { cacheCode, logType, comment, when, oauthToken, oauthTokenSecret } = JSON.parse(event.body);

  console.log({ cacheCode, logType, comment, when, oauthToken, oauthTokenSecret });
  const data = {
    url: 'https://opencaching.pl/okapi/services/logs/submit',
    method: 'POST',
    data: {
      cache_code: cacheCode,
      logtype: logType,
      comment: comment,
      when: when
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
      json: true,
      timeout: 500
    }
  ));

  console.log('error, result', error, result);

  return !error ? returnResponse(201, result) : returnResponse(error.statusCode, error.body)
}

exports.invoke = invoke;