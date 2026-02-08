const express = require("express");
const router = express.Router();
const {
  getUserData,
  addFavorite,
  removeFavorite,
  addWatched,
  removeWatched,
  changePassword,
} = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { verifyOwnership } = require("../middlewares/ownership.middleware");
const {
  addMovieValidation,
  removeMovieValidation,
  changePasswordValidation,
} = require("../middlewares/validators/user.validator");
const {
  handleValidationErrors,
} = require("../middlewares/validators/validation.middleware");

/**
 * GET /api/users/:id
 * Obtener datos de un usuario con sus favoritos y películas vistas
 */
router.get("/:id", authenticateToken, getUserData);

/**
 * POST /api/users/:id/favorites
 * Agregar película a favoritos
 * Requiere autenticación y ser el propietario
 */
router.post(
  "/:id/favorites",
  authenticateToken,
  verifyOwnership,
  addMovieValidation,
  handleValidationErrors,
  addFavorite,
);

/**
 * DELETE /api/users/:id/favorites/:movieId
 * Eliminar película de favoritos
 * Requiere autenticación y ser el propietario
 */
router.delete(
  "/:id/favorites/:movieId",
  authenticateToken,
  verifyOwnership,
  removeMovieValidation,
  handleValidationErrors,
  removeFavorite,
);

/**
 * POST /api/users/:id/watched
 * Agregar película a vistas
 * Requiere autenticación y ser el propietario
 */
router.post(
  "/:id/watched",
  authenticateToken,
  verifyOwnership,
  addMovieValidation,
  handleValidationErrors,
  addWatched,
);

/**
 * DELETE /api/users/:id/watched/:movieId
 * Eliminar película de vistas
 * Requiere autenticación y ser el propietario
 */
router.delete(
  "/:id/watched/:movieId",
  authenticateToken,
  verifyOwnership,
  removeMovieValidation,
  handleValidationErrors,
  removeWatched,
);

/**
 * PATCH /api/users/:id/password
 * Cambiar contraseña del usuario
 * Requiere autenticación y ser el propietario
 */
router.patch(
  "/:id/password",
  authenticateToken,
  verifyOwnership,
  changePasswordValidation,
  handleValidationErrors,
  changePassword,
);

module.exports = router;
