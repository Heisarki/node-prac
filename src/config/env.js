require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 3000,
    DB_USER: process.env.DB_USER || "postgres",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT) || 5432,
    DB_NAME: process.env.DB_NAME || "demo",
    DB_PASSWORD: process.env.DB_PASSWORD || "pghskp02",
    SECRET_KEY: process.env.SECRET_KEY,
};
