require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start Server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
