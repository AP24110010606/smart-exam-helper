const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('\n======================================================');
    console.error('🚨 ERROR: MONGODB_URI is not set in your .env file!');
    console.error('If you moved to a new laptop, make sure your .env file is copied over.');
    console.error('======================================================\n');
    throw new Error('MONGODB_URI is missing');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('\n================================================================================================');
    console.error('🚨 DATABASE CONNECTION FAILED! 🚨');
    console.error('You are probably on a new laptop that does NOT have MongoDB installed locally.');
    console.error('Because MONGODB_URI is set to "' + uri + '" (which expects a local server).');
    console.error('');
    console.error('HOW TO FIX IT SO IT WORKS ON ANY LAPTOP FOREVER:');
    console.error('1. Create a free cloud database at MongoDB Atlas (https://www.mongodb.com/cloud/atlas)');
    console.error('2. Get the connection string (mongodb+srv://...)');
    console.error('3. Open server/.env and replace MONGODB_URI with your new cloud string.');
    console.error('4. Restart the server. Then it will automatically work on ANY laptop!');
    console.error('================================================================================================\n');
    throw err;
  }
}

module.exports = connectDB;
