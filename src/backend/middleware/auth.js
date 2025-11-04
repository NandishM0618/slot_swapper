const User = require('../models/user')
const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        req.user = user;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware