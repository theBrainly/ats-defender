import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Analysis from "../models/Analysis.js"
import  authMiddleware  from "../middleware/auth.js"
import { uploadAvatar } from "../middleware/upload.js"

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
    // console.log(user)
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
    // console.log(email,password)

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

// POST /api/auth/upload-avatar - Upload user avatar
router.post("/upload-avatar", authMiddleware, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    console.log("Avatar upload request received");
    console.log("File:", req.file);
    
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select an image file",
      });
    }

    const userId = req.user.id;
    const avatarUrl = req.file.path; // Cloudinary URL
    console.log("Avatar URL:", avatarUrl);

    // Update user's avatar in database
    const user = await User.findByIdAndUpdate(
      userId,
      { 'profile.avatar': avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User account does not exist",
      });
    }

    console.log("Avatar upload successful");
    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl: avatarUrl,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to upload avatar",
    });
  }
});

// PUT /api/auth/change-password - Change user password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Validate current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: "Invalid password",
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to change password",
    });
  }
});

// GET /api/auth/export-data - Export user data
router.get("/export-data", authMiddleware, async (req, res) => {
  try {
    console.log("Export data request received for user:", req.user.email);
    const user = req.user;
    
    // Get user's analysis data
    const analyses = await Analysis.find({ userId: user._id });
    console.log("Found analyses:", analyses.length);

    const exportData = {
      user: {
        name: user.name,
        email: user.email,
        profile: user.profile,
        subscription: user.subscription,
        createdAt: user.createdAt,
      },
      analyses: analyses.map(analysis => ({
        id: analysis._id,
        resumeText: analysis.resumeText,
        jobDescription: analysis.jobDescription,
        score: analysis.score,
        feedback: analysis.feedback,
        createdAt: analysis.createdAt,
      })),
      exportDate: new Date().toISOString(),
    };

    console.log("Sending export data response");
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="ats-defender-data.json"');
    res.json(exportData);
  } catch (error) {
    console.error("Data export error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to export data",
    });
  }
});

// DELETE /api/auth/delete-account - Delete user account
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Delete user's analysis data
    await Analysis.deleteMany({ userId: user._id });

    // Delete user account
    await User.findByIdAndDelete(user._id);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to delete account",
    });
  }
});

// PUT /api/auth/settings - Save user settings
router.put("/settings", authMiddleware, async (req, res) => {
  try {
    const { notifications, privacy, preferences } = req.body;
    const user = req.user;

    // Update user settings
    if (!user.settings) {
      user.settings = {};
    }
    
    if (notifications) user.settings.notifications = notifications;
    if (privacy) user.settings.privacy = privacy;
    if (preferences) user.settings.preferences = preferences;

    await user.save();

    res.json({
      success: true,
      message: "Settings saved successfully",
      settings: user.settings,
    });
  } catch (error) {
    console.error("Settings save error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to save settings",
    });
  }
});

export default router
