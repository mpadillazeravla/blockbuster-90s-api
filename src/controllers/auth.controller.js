const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { generateToken } = require("../utils/jwt.utils");

/**
 * Controlador para el registro de nuevos usuarios
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash de la contraseña
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar user en BBDD
    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    const userId = result.insertId;

    // Generar token JWT
    const token = generateToken(userId, username, email);

    // return de respuesta ok
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: userId,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Controlador para el login de usuarios
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos user por mail
    const [rows] = await db.query(
      "SELECT id, username, email, password FROM users WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = generateToken(user.id, user.username, user.email);

    // Devolver ok
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Controlador para el logout de usuarios
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 */
const logout = async (req, res) => {
  try {
    // Manejamos logout en el lado del cliente, aqui solo confirmamos
    res.status(200).json({
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  register,
  login,
  logout,
};
