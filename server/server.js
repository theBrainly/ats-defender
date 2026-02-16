import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname } from "path"
import authRoutes from "./routes/authRoutes.js"
import analysisRoutes from "./routes/analysisRoutes.js"
import authMiddleware from "./middleware/auth.js"
import connectDB from "./config/db.js";
import path from "path";
import contactRoutes from "./routes/contactRoutes.js";

const app = express()


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: [
    process.env.CORS_URL || "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
  ],
  credentials: true
}))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// MongoDB Connection

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/analysis", authMiddleware, analysisRoutes)
app.use("/api/contact", contactRoutes)

console.log("Auth routes loaded successfully")

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "ATS Defender API is running" })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  })
})

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`)
})
