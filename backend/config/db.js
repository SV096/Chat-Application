const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true, // Let Mongoose create indexes automatically
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;

