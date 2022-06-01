const mongoose = require("mongoose");

const CanastaSchema = new mongoose.Schema(
  {
    usuarioId: { type: String, required: true },
    productos: [
      {
        productoId: {
          type: String,
        },
        cantidad: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Canasta", CanastaSchema);