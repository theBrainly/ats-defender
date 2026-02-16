import mongoose from "mongoose"

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: "general",
        },
        status: {
            type: String,
            enum: ["new", "read", "replied", "archived"],
            default: "new",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Contact", contactSchema)
