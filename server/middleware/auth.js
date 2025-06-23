import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: './env' });
const authMiddleware = (req, res, next) => {
    // Extract token from the Authorization header (Bearer <token>)
    console.log(req.body)
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token)

    // Check if token is present
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token,process.env.ACCESS_SECERT_TOKEN);
        console.log(decoded)

        // Attach the decoded user data to the request object for use in subsequent middleware/routes
        req.user = decoded;
        

        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token." });
    }
};

export default authMiddleware;
