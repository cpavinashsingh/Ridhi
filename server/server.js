require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');

const connectDB = require('./models/db');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const initializeSocket = require('./socket');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
const allowedOrigins = (process.env.CLIENT_URL || process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true
  })
);
app.use(express.json());

app.use('/api', apiRoutes);

if (isProduction) {
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const mongoUri = process.env.MONGO_URI;
  const retryMs = Number(process.env.DB_RETRY_MS || 10000);

  const connectWithRetry = async () => {
    try {
      await connectDB(mongoUri);
    } catch (error) {
      console.error(
        `MongoDB connection failed (${error.message}). Retrying in ${retryMs}ms...`
      );
      setTimeout(connectWithRetry, retryMs);
    }
  };

  if (!mongoUri) {
    console.warn(
      'MONGO_URI is not set. Server will run without database until it is configured.'
    );
    return;
  }

  void connectWithRetry();
};

startServer();
