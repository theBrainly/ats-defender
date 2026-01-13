import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config({ path: './.env' });
/**
 * Active: 2026-01-05
 * Function: connectDB
 */
/**
 * Active: 2026-01-08
 * Function: connectDB
 */
/**
 * Active: 2026-01-11
 * Function: connectDB
 */
/**
 * Active: 2026-01-12
 * Function: connectDB
 */
/**
 * Active: 2026-01-13
 * Function: connectDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;