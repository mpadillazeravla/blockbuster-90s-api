const { validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación de express-validator
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      campo: err.path,
      mensaje: err.msg
    }));

    return res.status(400).json({
      message: 'Errores de validación',
      errores: formattedErrors
    });
  }

  next();
};

module.exports = { handleValidationErrors };
