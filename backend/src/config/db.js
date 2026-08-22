const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://siddharthcentennialinfotech_db_user:Center123@ac-tud1puk-shard-00-00.wlkdltz.mongodb.net:27017,ac-tud1puk-shard-00-01.wlkdltz.mongodb.net:27017,ac-tud1puk-shard-00-02.wlkdltz.mongodb.net:27017/?ssl=true&replicaSet=atlas-116bfx-shard-0&authSource=admin&appName=Cluster0";
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
  }
};

module.exports = connectDB;
