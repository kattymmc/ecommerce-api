const Pedido = require("../models/Pedido");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const nuevoPedido = new Pedido(req.body);

  try {
    const pedidoGuardado = await nuevoPedido.save();
    res.status(200).json(pedidoGuardado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(pedidoActualizado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.status(200).json("El pedido ha sido eliminado...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const pedidos = await Pedido.find({ userId: req.params.userId });
    res.status(200).json(pedidos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/ingreso", verifyTokenAndAdmin, async (req, res) => {
  const fecha = new Date();
  const ultimoMes = new Date(fecha.setMonth(fecha.getMonth() - 1));
  const penultimoMes = new Date(new Date().setMonth(ultimoMes.getMonth() - 1));

  try {
    const ingreso = await Pedido.aggregate([
      { $match: { createdAt: { $gte: penultimoMes } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          ventas: "$monto",
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$ventas" },
        }
      }
    ]);
    res.status(200).json(ingreso);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;