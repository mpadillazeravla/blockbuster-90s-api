/**
 * Middleware para verificar que el usuario autenticado
 * es el propietario del recurso
 * Se usa después de authenticateToken
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
const verifyOwnership = (req, res, next) => {
  try {
    // req.user viene del middleware authenticateToken
    const authenticatedUserId = req.user.id;
    // req.params.id es el ID del usuario del endpoint
    const resourceUserId = parseInt(req.params.id);

    if (authenticatedUserId !== resourceUserId) {
      return res.status(403).json({
        message: "No tienes permiso para realizar esta acción",
      });
    }

    next();
  } catch (error) {
    console.error("Error en verificación de propietario:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { verifyOwnership };
