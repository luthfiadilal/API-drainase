const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Jumlah maksimal koneksi ke database yang dibuka
  queueLimit: 0
});

// Test koneksi database saat file ini dipanggil
pool.getConnection()
  .then((conn) => {
    console.log('[Database] Berhasil terhubung ke database MySQL');
    conn.release();
  })
  .catch((err) => {
    console.error('[Database] Gagal terhubung ke database:', err.message);
  });

module.exports = pool;
