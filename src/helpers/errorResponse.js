/**
 * New class "CustomError" inherit from the class "Error". The constructor from the class
 * takes as parameters a message (message), a status code (statusCode) and an array of errors.res.
 * 
 * The errors generate from this class are taken by the middleware responsible for the errors.

 * @param {String} message Info about the error
 * @param {Number} statusCode Status code of the error
 * @param {String[]} errors Array of errors if there are any
 **/

class CustomError extends Error {
  constructor(message, statusCode, errors = []) {
    super();

    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
