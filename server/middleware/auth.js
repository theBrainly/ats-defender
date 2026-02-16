import jwt from "jsonwebtoken"
import User from "../models/User.js"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from the Authorization header (Bearer <token>)
    const token = req.header("Authorization")?.replace("Bearer ", "")

    // Check if token is present
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.ACCESS_SECERT_TOKEN)

    // Fetch the full user data from database
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found." })
    }

    // Attach the user data to the request object
    req.user = user

    next()
  } catch (err) {
    console.error("Auth middleware error:", err)
    res.status(400).json({ message: "Invalid token." })
  }
}

export default authMiddleware
