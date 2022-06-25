const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const usuariosRoute = require("./routes/usuario")
const productosRoute = require("./routes/producto")
const canastaRoute = require("./routes/canasta")
const pedidoRoute = require("./routes/pedido")
const authRoute = require("./routes/auth")

dotenv.config();

const app = express();
mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Conexión a mongodb exitosa"))
        .catch((err) => console.log(err));

// configuracion de cabeceras para aceptar las peticiones AJAX desde cualquier origen
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

// Aceptar peticiones en formato json
app.use(express.json());
// Especificamos la ruta inicial
app.use("/api/user", usuariosRoute);
app.use("/api/product", productosRoute);
app.use("/api/canasta", canastaRoute);
app.use("/api/pedido", pedidoRoute);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Ecommerce API esta corriendo !")
})