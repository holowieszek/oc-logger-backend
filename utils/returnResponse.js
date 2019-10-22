const returnResponse = (status, value) => {
  return {
    statusCode: status,
    body: JSON.stringify(value)
  }
}

module.exports = returnResponse;