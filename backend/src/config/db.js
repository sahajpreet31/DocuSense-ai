const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.warn("MongoDB connection failed:", err.message);
    console.warn("Continuing without a database connection — routes that need MongoDB will fail until this is resolved.");
  }
}

module.exports = connectDB;
