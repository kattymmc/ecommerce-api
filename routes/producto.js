const Producto = require("../models/Producto");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const nuevoProducto = new Producto(req.body);
    try {
        const guardarProducto = await nuevoProducto.save();
        res.status(200).json(guardarProducto);
    } catch (err) {
        res.status(500).json(err);
    }
});
 
//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const actualizarProducto = await Producto.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(actualizarProducto);
    } catch (err) {
        res.status(500).json(err);
    }
});
  
//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.status(200).json("El producto se ha eliminado...");
    } catch (err) {
        res.status(500).json(err);
    }
});
  
//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        res.status(200).json(producto);
    } catch (err) {
        res.status(500).json(err);
    }
});
  
  //GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNuevo = req.query.nuevo;
    const qCategoria = req.query.categoria;
    try {
        let productos;

        if (qNuevo) {
            productos = await Producto.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategoria) {
            productos = await Producto.find({
                categorias: {
                $in: [qCategoria],
                },
            });
        } else {
            productos = await Producto.find();
        }

        res.status(200).json(productos);
    } catch (err) {
        res.status(500).json(err);
    }
});
  
module.exports = router;