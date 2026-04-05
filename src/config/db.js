require("dotenv").config();

const mysql = require("mysql2");

// conexion BBDD para local
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// conexion BBDD para producción
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Error al conectar con la BBDD:", err);
    return;
  }
  console.log("✅ Conexión a la BBDD exitosa!");
  // Libera la conexión
  conn.release();
});

module.exports = pool.promise();
