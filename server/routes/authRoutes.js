import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import  authMiddleware  from "../middleware/auth.js"

const router = express.Router()

// POST /api/auth/register - Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Name, email, and password are required",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Invalid password",
        message: "Password must be at least 6 characters long",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        message: "An account with this email already exists",
      })
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    })
    console.log(user)
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_SECERT_TOKEN || "your-secret-key", {
      expiresIn: "7d",
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to register user",
    })
  }
})

// POST /api/auth/login - Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(email,password)

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Email and password are required",
      })
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    })

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Invalid email or password",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Invalid email or password",
      })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_SECERT_TOKEN || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        profile: user.profile,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to process login",
    })
  }
})

// GET /api/auth/profile - Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user= req.user

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User account does not exist",
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to fetch profile",
    })
  }
})

// PUT /api/auth/profile - Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, profile } = req.body
    const userId = req.user.id

    const updateData = {}
    if (name) updateData.name = name.trim()
    if (profile) updateData.profile = profile

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User account does not exist",
      })
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        profile: user.profile,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to update profile",
    })
  }
})

export default router
