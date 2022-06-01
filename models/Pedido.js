const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema(
  {
    usuarioId: { 
        type: String,
        required: true 
    },
    productos: [
      {
        productoId: {
          type: String,
        },
        cantidad: {
          type: Number,
          default: 1,
        }
      }
    ],
    monto: { 
        type: Number,
        required: true
    },
    direccion: {
        type: Object,
        required: true
    },
    estado: { 
        type: String,
        default: "pendiente" 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pedido", PedidoSchema);