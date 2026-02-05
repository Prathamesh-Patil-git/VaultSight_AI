const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    winston.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    winston.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
