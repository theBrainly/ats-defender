import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      currentRole: String,
      experience: Number,
      skills: [String],
      location: String,
    },
    subscription: {
      type: {
        type: String,
        enum: ["free", "premium", "enterprise"],
        default: "free",
      },
      scansUsed: {
        type: Number,
        default: 0,
      },
      scansLimit: {
        type: Number,
        default: 5, // Free tier limit
      },
      expiresAt: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Check if user can perform scan
userSchema.methods.canPerformScan = function () {
  return this.subscription.scansUsed < this.subscription.scansLimit
}

// Increment scan count
userSchema.methods.incrementScanCount = async function () {
  this.subscription.scansUsed += 1
  return this.save()
}

export default mongoose.model("User", userSchema)
