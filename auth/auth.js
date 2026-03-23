const jwt = require('jsonwebtoken');
const env = require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '14m' });
}

console.log("Secret Key:", generateToken({ userId: 123, name: "John Doe" }));