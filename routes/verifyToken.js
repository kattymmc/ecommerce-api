const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;

    // Si es que existe el token en la cabecera
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        // Verificar que el token sea el correcto
        jwt.verify(token, process.env.JWT_SEC, (err, usuario) => {
            if (err) res.status(403).json("Su token no es valido!");
            req.usuario = usuario;
            // Continuara con la funcion de la cual ha sido llamada
            next();
        });
    } else {
        return res.status(401).json("No se encuentra autenticado.");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    console.log("User req", req.usuario);
    verifyToken(req, res, () => {
        if (req.usuario.id === req.params.id || req.usuario.isAdmin) {
            next();
        } else {
            res.status(403).json("Usted no esta autorizado!");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.usuario.isAdmin) {
            next();
        } else {
            res.status(403).json("Usted no esta autorizado!");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
  };