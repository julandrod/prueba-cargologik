import mongoose from "mongoose";

const VentaSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  cliente: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Venta", VentaSchema);
