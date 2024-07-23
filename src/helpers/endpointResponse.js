/**
 * Return a format response for the endpoint
 *
 * @param {Object} res - res property directly from the http request
 * @param {Number} code - status code from the http request, defeault value 200
 * @param {String} message - message info about the response
 * @param {Object} body - info/properties from the request
 *
 * @example
 * endPointResponse({
 *  res,
 *  code: 201,
 *  message: "User created"
 *  body: {
 *    user,
 *    token
 *  }
 * })
 */

export const endpointResponse = ({ res, code = 200, message, body }) => {
  res.status(code).json({ code, message, body });
};

