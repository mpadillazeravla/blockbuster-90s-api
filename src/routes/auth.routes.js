const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validators/auth.validator");
const {
  handleValidationErrors,
} = require("../middlewares/validators/validation.middleware");
const { authenticateToken } = require("../middlewares/auth.middleware");

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post("/register", registerValidation, handleValidationErrors, register);

/**
 * POST /api/auth/login
 * Iniciar sesión con credenciales
 */
router.post("/login", loginValidation, handleValidationErrors, login);

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post("/logout", authenticateToken, logout);

module.exports = router;
