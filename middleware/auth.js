const jwt = require('jsonwebtoken');

// Use the secret key from environment variables
const secretKey = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        // Respond with a 401 status if no token is provided
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, secretKey);

        // Attach the decoded user data to the request object for downstream use
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        
        // Respond with a 403 status for invalid or expired tokens
        res.status(403).json({ message: "Invalid or expired token." });
    }
}

module.exports = authenticateToken;
