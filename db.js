import mongoose from "mongoose";
import "dotenv/config";

const DB_URI = process.env.DB_URI;

const connect = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connection successful");
  } catch (error) {
    throw error.message;
  }
};

export default connect;
