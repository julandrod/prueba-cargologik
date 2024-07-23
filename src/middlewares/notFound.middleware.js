import CustomError from "../helpers/errorResponse.js";

/**
 * Throw a custom error if the route is not found
 *
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Next} next Next middleware function
 *
 */
export const notFoundMiddleware = (req, res, next) => {
  throw new CustomError("No se encontro la ruta", 404);
};
