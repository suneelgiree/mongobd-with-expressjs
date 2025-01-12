const mongoose = require("mongoose"); //import mongoose
const mongoURI = "mongodb://localhost:27017/user"; // Define the MongoDB URI

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);// Connect to MongoDB
    console.log("Connected to MongoDB!");// Log a success message
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

module.exports = connectDB;
