const db = require("../config/db");
const bcrypt = require("bcryptjs");

/**
 * Obtener datos de usuario con sus favoritos y películas vistas
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const getUserData = async (req, res) => {
  try {
    const userId = req.params.id;

    const [userPromise, favoritesPromise, watchedPromise] = [
      db.query("SELECT id, username, email FROM users WHERE id = ?", [userId]),
      db.query("SELECT movie_id FROM user_favorites WHERE user_id = ?", [
        userId,
      ]),
      db.query("SELECT movie_id FROM user_watched WHERE user_id = ?", [userId]),
    ];

    const [[userData]] = await userPromise;
    const [favoriteRows] = await favoritesPromise;
    const [watchedRows] = await watchedPromise;

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      user: userData,
      favorites: favoriteRows.map((row) => row.movie_id),
      watched: watchedRows.map((row) => row.movie_id),
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Agregar película a favoritos
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const addFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const { movie_id } = req.body;

    // Verificar si ya existe en favoritos
    const [existing] = await db.query(
      "SELECT id FROM user_favorites WHERE user_id = ? AND movie_id = ?",
      [userId, movie_id],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "La película ya está en favoritos",
      });
    }

    // Insertar en favoritos
    await db.query(
      "INSERT INTO user_favorites (user_id, movie_id) VALUES (?, ?)",
      [userId, movie_id],
    );

    res.status(201).json({
      message: "Película agregada a favoritos exitosamente",
      user_id: parseInt(userId),
      movie_id: parseInt(movie_id),
    });
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Eliminar película de favoritos
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const removeFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const movieId = req.params.movieId;

    const [result] = await db.query(
      "DELETE FROM user_favorites WHERE user_id = ? AND movie_id = ?",
      [userId, movieId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "La película no está en favoritos",
      });
    }

    res.status(200).json({
      message: "Película eliminada de favoritos exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Agregar película a vistas
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const addWatched = async (req, res) => {
  try {
    const userId = req.params.id;
    const { movie_id } = req.body;

    // Verificar si ya existe en vistas
    const [existing] = await db.query(
      "SELECT id FROM user_watched WHERE user_id = ? AND movie_id = ?",
      [userId, movie_id],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "La película ya está en vistas",
      });
    }

    // Insertar en vistas
    await db.query(
      "INSERT INTO user_watched (user_id, movie_id) VALUES (?, ?)",
      [userId, movie_id],
    );

    res.status(201).json({
      message: "Película agregada a vistas exitosamente",
      user_id: parseInt(userId),
      movie_id: parseInt(movie_id),
    });
  } catch (error) {
    console.error("Error al agregar película vista:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Eliminar película de vistas
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const removeWatched = async (req, res) => {
  try {
    const userId = req.params.id;
    const movieId = req.params.movieId;

    const [result] = await db.query(
      "DELETE FROM user_watched WHERE user_id = ? AND movie_id = ?",
      [userId, movieId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "La película no está en vistas",
      });
    }

    res.status(200).json({
      message: "Película eliminada de vistas exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar película vista:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Cambiar contraseña del usuario
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Obtener contraseña actual del usuario
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "La contraseña actual es incorrecta",
      });
    }

    // Hash para la nueva contraseña
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  getUserData,
  addFavorite,
  removeFavorite,
  addWatched,
  removeWatched,
  changePassword,
};
