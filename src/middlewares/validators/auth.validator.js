const { body } = require('express-validator');
const db = require('../../config/db');

/**
 * Reglas de validación para el registro de usuarios
 */
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos')
    .custom(async (username) => {
      const [rows] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
      if (rows.length > 0) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      return true;
    }),

  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido')
    .isEmail().withMessage('El correo electrónico no es válido')
    .normalizeEmail()
    .custom(async (email) => {
      const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        throw new Error('El correo electrónico ya está en uso');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
];

/**
 * Reglas de validación para el login de usuarios
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido')
    .isEmail().withMessage('El correo electrónico no es válido'),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
];

module.exports = {
  registerValidation,
  loginValidation
};
