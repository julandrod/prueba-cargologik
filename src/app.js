import express from "express";
import { connectDB } from "./db/connect.js";
import ventasRouter from "./routes/ventas.routes.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/errors.middleware.js";

const app = express();
const port = process.env.PORT || 8080;

app.get("/api/v1", (req, res) => {
  res.send("Cargologik");
});

app.use("/api/v1/ventas", ventasRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {}
};

startServer();
