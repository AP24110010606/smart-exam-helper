const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
