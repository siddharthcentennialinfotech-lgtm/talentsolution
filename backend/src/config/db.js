const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const attemptConnect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}. Retrying in 5 seconds...`);
      setTimeout(attemptConnect, 5000);
    }
  };

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
  });

  await attemptConnect();
};

module.exports = connectDB;
