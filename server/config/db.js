// db.js - yeh file MongoDB se connection banati hai
const mongoose = require('mongoose');

// connectDB function MongoDB Atlas ya local MongoDB se connect karta hai
const connectDB = async () => {
  try {
    // mongoose.connect se database connection establish hota hai
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // agar connection fail ho jaye to error show karo aur process exit karo
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
