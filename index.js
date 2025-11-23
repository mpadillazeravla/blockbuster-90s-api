require("dotenv").config();

const express = require("express");
const app = express();

const db = require("./src/config/db");

const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
 * RUTA DE PRUEBA
 * Vamos a traer toda la información de un usuario por su ID
 */
app.get("/user-data/:id", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
