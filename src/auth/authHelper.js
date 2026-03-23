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

module.exports = { generateToken, verifyToken };
