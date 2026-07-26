const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Security HTTP Headers
app.use(helmet());

// CORS configuration
app.use(cors());

// Request logging (development mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing (JSON & URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API routes
app.use('/api/v1', routes);

// Handle 404 Route Not Found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server!`
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
