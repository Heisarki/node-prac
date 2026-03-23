const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/env");

const generateToken = (payload, expiresIn = "1h") => {
    if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined in environment");
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

const verifyToken = (token) => {
    if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined in environment");
    return jwt.verify(token, SECRET_KEY);
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required"
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // e.g., { id, email }
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = { generateToken, verifyToken, authenticateToken };
