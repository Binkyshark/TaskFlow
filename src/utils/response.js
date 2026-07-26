/**
 * Formats standard API responses
 */
const sendResponse = (res, { statusCode = 200, success = true, message = 'Success', data = null, meta = null }) => {
  const responseBody = {
    success,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta })
  };

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  sendResponse
};
