const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
    {
        titulo: {
            type: String, 
            required: true, 
            unique: true 
        },
        descripcion: {
            type: String,
            required: true
        },
        imagen: {
            type: String,
            required: true
        },
        categorias: {
            type: Array
        },
        tamano: {
            type: String
        },
        color: {
            type: String
        },
        precio: { 
            type: Number, 
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Producto", ProductoSchema);