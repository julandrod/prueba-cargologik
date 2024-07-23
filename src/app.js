import express from "express";
import { connectDB } from "./db/connect.js";
import ventasRouter from "./routes/ventas.routes.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/errors.middleware.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { options } from "./swagger-doc/options.js";


const app = express();
const port = process.env.PORT || 8080;

app.get("/api/v1", (req, res) => {
  res.send("Cargologik");
});

app.use("/api/v1/ventas", ventasRouter)

// Ruta para la documentacion de la API en swagger
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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
