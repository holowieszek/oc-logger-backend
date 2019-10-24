const rp = require('request-promise');
const asyncWrapper = require('../utils/asyncWrapper');
const returnResponse = require('../utils/returnResponse');

const invoke = async event => {
  console.log(event);

  const { cacheCode } = JSON.parse(event.body);

  const data = {
    cache_code: cacheCode,
    consumer_key: process.env.CONSUMER_KEY
  }

  const { error, result } = await asyncWrapper(rp(
    {
      url: 'https://opencaching.pl/okapi/services/caches/geocache',
      method: 'GET',
      qs: data,
      json: true
    }
  ));

  return !error ? returnResponse(201, result) : returnResponse(error.statusCode, error.body)
}

exports.invoke = invoke;