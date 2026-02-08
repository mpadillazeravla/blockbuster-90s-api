const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT con la información del usuario
 * @param {number} userId - ID del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} email - Email del usuario
 * @returns {string} Token JWT firmado
 */
const generateToken = (userId, username, email) => {
  return jwt.sign(
    { id: userId, username, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {object} Payload decodificado del token
 * @throws {Error} Si el token es inválido o ha expirado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
