const oauth = require('./oauth');
const rp = require('request-promise');
const asyncWrapper = require('../utils/asyncWrapper');
const returnResponse = require('../utils/returnResponse');

const invoke = async event => {
  console.log(event);
  
  const data = {
    url: 'https://opencaching.pl/okapi/services/oauth/request_token',
    method: 'POST',
    data: {
      oauth_callback: process.env.OAUTH_CALLBACK
    }
  };

  const { error, result } = await asyncWrapper(rp(
    {
      url: data.url,
      method: data.method,
      form: oauth.authorize(data),
      json: true
    }
  ))

  return !error ? returnResponse(200, result) : returnResponse(error.statusCode, error.message);
};

exports.invoke = invoke;