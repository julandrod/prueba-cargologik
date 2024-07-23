import mongoose from "mongoose";

/**
 * Gestiona la conexion a la base de datos de mongo DB
 * 
 * @param {string} url url de mongo para conectarse a la base de datos
 * @returns mensaje de conexion exitosa o mensaje de error
 */
export const connectDB = async (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("MongoDB connection successful!"))
    .catch((error) => console.log(error));
};

