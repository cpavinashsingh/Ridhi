const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log('MongoDB connected');
};

module.exports = connectDB;
