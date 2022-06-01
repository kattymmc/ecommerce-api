const Canasta = require("../models/Canasta");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const nuevaCanasta = new Canasta(req.body);
  try {
    const canastaGuardada = await nuevaCanasta.save();
    res.status(200).json(canastaGuardada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const canastaActualizada = await Canasta.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(canastaActualizada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Canasta.findByIdAndDelete(req.params.id);
    res.status(200).json("La canasta ha sido eliminada...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const canasta = await Canasta.findOne({ userId: req.params.userId });
    res.status(200).json(canasta);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const canastas = await Canasta.find();
    res.status(200).json(canastas);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;