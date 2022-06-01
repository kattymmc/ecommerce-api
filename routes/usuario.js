const Usuario = require("../models/Usuario");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
    ).toString();
    }

    try {
    const updatedUser = await Usuario.findByIdAndUpdate(
        req.params.id,
        { $set: req.body }, // le pasamos el nuevo usuario
        { new: true } // para que obtenga el nuevo usuario y no el antiguo
    );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await Usuario.findByIdAndDelete(req.params.id);
      res.status(200).json("El usuario ha sido eliminado...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        const { password, ...others } = usuario._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});
  
//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const usuarios = query
        ? await Usuario.find().sort({ _id: -1 }).limit(5)
        : await Usuario.find();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json(err);
    }
});
  
//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await Usuario.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: { month: { $month: "$createdAt" } }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;