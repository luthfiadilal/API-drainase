const express = require('express');
const cors = require('cors');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
const fs = require('fs');
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));
app.use('/api/uploads', express.static(uploadDir));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Drainase Backend API' });
});

// Register all API routes
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
