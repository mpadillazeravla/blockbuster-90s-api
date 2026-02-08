const { body, param } = require('express-validator');

/**
 * Validación para agregar película a favoritos o watched
 */
const addMovieValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero positivo'),

  body('movie_id')
    .notEmpty().withMessage('El ID de la película es requerido')
    .isInt({ min: 1 }).withMessage('El ID de la película debe ser un número entero positivo')
];

/**
 * Validación para eliminar película de favoritos o watched
 */
const removeMovieValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero positivo'),

  param('movieId')
    .isInt({ min: 1 }).withMessage('El ID de la película debe ser un número entero positivo')
];

/**
 * Validación para cambio de contraseña
 */
const changePasswordValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero positivo'),

  body('currentPassword')
    .notEmpty().withMessage('La contraseña actual es requerida'),

  body('newPassword')
    .notEmpty().withMessage('La nueva contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }
      return true;
    })
];

module.exports = {
  addMovieValidation,
  removeMovieValidation,
  changePasswordValidation
};
