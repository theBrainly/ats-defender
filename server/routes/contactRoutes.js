import express from "express"
import Contact from "../models/Contact.js"
import authMiddleware from "../middleware/auth.js"

const router = express.Router()

// POST /api/contact - Submit a contact form message
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message, category } = req.body

        // Optional: get user ID if authenticated (frontend might send token, but page is public)
        // We'll check if a user exists with this email to link internally, or just store it.

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "Name, email, subject, and message are required"
            })
        }

        const contact = new Contact({
            name,
            email,
            subject,
            message,
            category: category || "general",
            // userId could be added if we parse the token, but for now let's keep it simple
        })

        await contact.save()

        res.status(201).json({
            success: true,
            message: "Message received successfully"
        })
    } catch (error) {
        console.error("Contact form error:", error)
        res.status(500).json({
            error: "Internal server error",
            message: "Unable to send message"
        })
    }
})

export default router
