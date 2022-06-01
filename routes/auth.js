const router = require("express").Router();
const Usuario = require("../models/Usuario");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTRO
router.post("/registro", async (req, res) => {
    const nuevoUsuario = new Usuario({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });

    try {
        const guardarUsuario = await nuevoUsuario.save();
        res.status(201).json(guardarUsuario);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN

router.post('/login', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            username: req.body.username
        });

        if(!usuario)
            res.status(401).json("Usuario y/o contraseña Incorrectos");

        const hashedPassword = CryptoJS.AES.decrypt(
            usuario.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;
        
        if(originalPassword != inputPassword) 
            res.status(401).json("Wrong Password");

        const accessToken = jwt.sign(
        {
            id: usuario._id,
            isAdmin: usuario.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
  
        // Separando la contraseña de la otra información
        const { password, ...others } = usuario._doc;
        res.status(200).json({...others, accessToken});

    } catch(err) {
        res.status(500).json(err);
    }

});

module.exports = router;