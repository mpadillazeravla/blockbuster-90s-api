require("dotenv").config();

const express = require("express");
const app = express();

// Importar rutas
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/", (_req, res) => {
  res.json({ message: "Blockbuster90 API - Running" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
