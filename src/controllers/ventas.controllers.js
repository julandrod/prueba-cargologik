import { endpointResponse } from "../helpers/endpointResponse.js";
import CustomError from "../helpers/errorResponse.js";
import Venta from "../models/Venta.js";

// Obtiene un listado completo de ventas y una propiedad con el total de ventas
const getAllVentas = async (req, res) => {
  try {
    const allVentas = await Venta.find();
    const totalVentas = allVentas.length;

    endpointResponse({
      res,
      message: "Ventas listada de manera exitosa",
      body: { allVentas, totalVentas },
    });
  } catch (error) {
    throw new CustomError(error.message, error.statusCode, error.errors);
  }
};

// Obtiene un resumen diario de ventas, calcula el total de ventas, productos vendidos y numero de transacciones
const getResumenDiario = async (req, res) => {
  try {
    const resumen = await Venta.aggregate([
      {
        // Se agrupan las ventas por dia
        $group: {
          // Se formatea la fecha
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          // Se hace una suma de todas las ventas del dias
          totalVentas: { $sum: "$precio" },
          // Se hace una suma de las cantidades vendidas
          cantidadProductos: { $sum: "$cantidad" },
          // Se cuentan la cantidad de ventas diarias
          numeroTransacciones: { $sum: 1 },
        },
      },
      {
        // Se ordenan los resultados por fecha de manera ascendente
        $sort: { _id: 1 },
      },
    ]);

    endpointResponse({ res, message: "Resumen diario", body: resumen });
  } catch (error) {
    throw new CustomError(error.message, error.statusCode, error.errors);
  }
};

// Obtiene los 5 productos mas vendidos
const getTopProductos = async (req, res) => {
  try {
    const topProductos = await Venta.aggregate([
      {
        // Agrupa la informacion por producto
        $group: {
          _id: "$producto",
          // Se hace una suma de las cantidades
          totalCantidad: { $sum: "$cantidad" },
          // Se calcula el total de ingresos suma de multiplicar cada cantidad por su precio
          totalIngresos: { $sum: { $multiply: ["$cantidad", "$precio"] } },
        },
      },
      {
        // Se ordena la informacion de manera descendente usando el total de ventas
        $sort: { totalCantidad: -1 },
      },
      {
        // Se limita a 5 productos para mostrar
        $limit: 5,
      },
    ]);

    endpointResponse({ res, message: "Top 5 productos", body: topProductos });
  } catch (error) {
    throw new CustomError(error.message, error.statusCode, error.errors);
  }
};

// Obtiene un analisis por cada categoria
const getAnalisisCategorias = async (req, res) => {
  try {
    const analisisCategoria = await Venta.aggregate([
      {
        // Se agrupa la informacion por categoria
        $group: {
          _id: "$categoria",
          // Se calcula el total de ventas sumando la multiplicacion de la cantidad por el precio
          totalVentas: { $sum: { $multiply: ["$cantidad", "$precio"] } },
          // Se promedian las ventas
          promedioVentas: { $avg: { $multiply: ["$cantidad", "$precio"] } },
          // Se cuentan las transacciones
          numeroTransacciones: { $sum: 1 },
        },
      },
      {
        // Se ordena la informacion de manera descendente usando el total de ventas
        $sort: { totalVentas: -1 },
      },
    ]);

    endpointResponse({
      res,
      message: "Analisis por categorias",
      body: analisisCategoria,
    });
  } catch (error) {
    throw new CustomError(error.message, error.statusCode, error.errors);
  }
};

// Obtiene estadisticas de rendimiento por cada region
const getRendimientoRegional = async (req, res) => {
  try {
    const rendimientoRegional = await Venta.aggregate([
      {
        // Se agrupa la informacion por region
        $group: {
          _id: "$region",
          // Se calcula el total de ventas
          totalVentas: { $sum: { $multiply: ["$cantidad", "$precio"] } },
          // Se cuenta el numero de transacciones
          numeroTransacciones: { $sum: 1 },
          // Se promedia el valor total de transacciones por region
          promedioTransaccion: {
            $avg: { $multiply: ["$cantidad", "$precio"] },
          },
          // Se crea un array con los productos vendidos por region
          productos: { $push: "$producto" },
        },
      },
      {
        // Se usa el operador $lookup para hacer una subconsulta del array
        // productos creado en la etapa anterior
        $lookup: {
          from: "productos",
          let: { region: "$_id" },

          pipeline: [
            { $match: { $expr: { $eq: ["$region", "$$region"] } } },
            {
              $group: {
                _id: "$producto",
                totalCantidad: { $sum: "$cantidad" },
              },
            },
            { $sort: { totalCantidad: -1 } },
            { $limit: 1 },
          ],
          as: "productoMasVendido",
        },
      },
      {
        $unwind: "$productoMasVendido",
      },
      {
        $project: {
          _id: 0,
          region: "$_id",
          totalVentas: 1,
          numeroTransacciones: 1,
          promedioTransaccion: 1,
          productoMasVendido: "$productoMasVendido._id",
          cantidadVendida: "$productoMasVendido.totalCantidad",
        },
      },
    ]);

    endpointResponse({
      res,
      message: "Analisis rendimiento regional",
      body: rendimientoRegional,
    });
  } catch (error) {
    throw new CustomError(error.message, error.statusCode, error.errors);
  }
};

// Obtiene estadisticas sobre las ventas mensuales
const getTendenciasMensuales = async (req, res) => {
  try {
    const tendenciasMensuales = await Venta.aggregate([
      {
        // Se agrupa la informacion por mes
        $group: {
          // Se formatea la fecha
          _id: { $dateToString: { format: "%Y-%m", date: "$fecha" } },
          // Se calcula el total de ventas por mes
          totalVentas: { $sum: { $multiply: ["$cantidad", "$precio"] } },
          // Se calcula el total de productos vendidos por mes
          cantidadProductosVendidos: { $sum: "$cantidad" },
        },
      },
      {
        // Se ordenan los resultados por mes de manera ascendente
        $sort: { _id: 1 },
      },
      {
        // Se seleccionan los campos a mostrar
        $project: {
          _id: 0,
          mes: "$_id",
          totalVentas: 1,
          cantidadProductosVendidos: 1,
        },
      },
    ]);

    // Se calcula el cambio porcentual en ventas respecto al mes anterior
    const tendenciasMensualesConCambio = tendenciasMensuales.map(
      (tendencia, index, array) => {
        // Si es el primer mes, no se calcula el cambio porcentual
        if (index === 0) {
          return { ...tendencia, cambioPorcentual: null };
        }
        // Obtengo el valor total de ventas del mes anterior
        const ventaAnterior = array[index - 1].totalVentas;
        // Calculo el cambio porcentual usando el total del ventas del mes anterior y el total de ventas del mes actual
        const cambioPorcentual =
          ((tendencia.totalVentas - ventaAnterior) / ventaAnterior) * 100;
        return { ...tendencia, cambioPorcentual };
      }
    );

    endpointResponse({
      res,
      message: "Analisis tendencias mensuales",
      body: tendenciasMensualesConCambio,
    });
  } catch (error) {
    throw new CustomError(error.message, error.statusCode, error.errors);
  }
};

// Obtiene estadisticas dentro de un rango de fechas ingresado por el usuario
const getAnalisisFechas = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new CustomError(
        "Debe incluir una fecha de inicio y otra de final",
        400
      );
    }

    const analisisFechas = await Venta.aggregate([
      {
        // Encuentra informacion que cumpla con las condiciones
        // fecha mayor o igual a startDate
        // fecha menor o igual a endDate
        $match: {
          fecha: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        // El operador $facet me permite crear diferentes pipelines en paralelo
        $facet: {
          // Crea un resumen general
          resumenGeneral: [
            {
              // Agrupa la informacion general
              $group: {
                // Se usa el id null para agrupar todos los documentos
                _id: null,
                // Se calcula el total de ventas
                totalVentas: { $sum: { $multiply: ["$cantidad", "$precio"] } },
                // Se calcula la cantidad total de productos
                cantidadTotalProductos: { $sum: "$cantidad" },
                // Se cuenta la cantidad de transacciones
                numeroTransacciones: { $sum: 1 },
              },
            },
          ],
          // Crea un resumen de ventas por categoria
          ventasPorCategoria: [
            {
              // Agrupa los documentos por categoria
              $group: {
                _id: "$categoria",
                totalVentas: { $sum: { $multiply: ["$cantidad", "$precio"] } },
                cantidadTotalProductos: { $sum: "$cantidad" },
                numeroTransacciones: { $sum: 1 },
              },
            },
            // Ordena las ventas por categoria en orden descendente
            { $sort: { totalVentas: -1 } },
          ],
          // Crea un resumen de ventas por mes
          ventasPorMes: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$fecha" } },
                totalVentas: { $sum: { $multiply: ["$cantidad", "$precio"] } },
                cantidadTotalProductos: { $sum: "$cantidad" },
                numeroTransacciones: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
      {
        // Se indica que propiedades seran mostradas
        $project: {
          resumenGeneral: { $arrayElemAt: ["$resumenGeneral", 0] },
          ventasPorCategoria: 1,
          ventasPorMes: 1,
        },
      },
    ]);

    endpointResponse({
      res,
      message: "Analisis por fechas",
      body: analisisFechas,
    });
  } catch (error) {
    throw new CustomError(error.message, error.statusCode, error.errors);
  }
};

export {
  getAllVentas,
  getResumenDiario,
  getTopProductos,
  getAnalisisCategorias,
  getRendimientoRegional,
  getTendenciasMensuales,
  getAnalisisFechas,
};
