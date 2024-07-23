import mongoose from "mongoose";

export const connectDB = async (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("MongoDB connection successful!"))
    .catch((error) => console.log(error));
};

