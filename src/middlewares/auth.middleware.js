const { verifyToken } = require("../utils/jwt.utils");

/**
 * Middleware para autenticar y verificar el token JWT
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
const authenticateToken = (req, res, next) => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token de autenticación no proporcionado" });
    }

    // Verificamos token
    const decoded = verifyToken(token);

    // Agregamos la info del usuario a la request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token de autenticación expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Token de autenticación inválido" });
    }

    return res.status(500).json({ message: "Error al verificar token" });
  }
};

module.exports = { authenticateToken };
