import { connectDB } from "./db/connect.js";
import {  fakerES_MX } from "@faker-js/faker";
import Venta from "./models/Venta.js";

/**
 * Genera datos aleatorio para la coleccion de ventas,
 * usando la libreria Fakerjs
 */

const seedVentas = async () => {
  await connectDB(process.env.MONGO_URL);

  try {
    for (let i = 0; i <= 100; i++) {
      const ventaSimple = await Venta.create({
        producto: fakerES_MX.commerce.product(),
        categoria: fakerES_MX.commerce.department(),
        precio: fakerES_MX.commerce.price(),
        cantidad: fakerES_MX.number.int({ min: 1, max: 100 }),
        fecha: fakerES_MX.date.anytime(),
        cliente: fakerES_MX.person.fullName(),
        region: fakerES_MX.location.city(),
      });
      console.log("data inserted");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }

  console.log("Seed data inserted successfully.");
};

seedVentas();
