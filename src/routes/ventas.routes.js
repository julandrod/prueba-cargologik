import { Router } from "express";
import {
  getAllVentas,
  getAnalisisCategorias,
  getAnalisisFechas,
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
ventasRouter.get("/tendencias-mensuales", getTendenciasMensuales);
ventasRouter.get("/analisis-fechas", getAnalisisFechas);

export default ventasRouter;
