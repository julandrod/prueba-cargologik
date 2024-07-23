import { Router } from "express";
import {
  getAllVentas,
  getAnalisisCategorias,
  getRendimientoRegional,
  getResumenDiario,
  getTendenciasMensuales,
  getTopProductos,
} from "../controllers/ventas.controllers.js";

const ventasRouter = Router();

ventasRouter.get("/", getAllVentas);
ventasRouter.get("/resumen-diario", getResumenDiario);
ventasRouter.get("/top-productos", getTopProductos);
ventasRouter.get("/analisis-categorias", getAnalisisCategorias);
ventasRouter.get("/rendimiento-regional", getRendimientoRegional);
ventasRouter.get("/tendencias-mensuales", getTendenciasMensuales)

export default ventasRouter;
