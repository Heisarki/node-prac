const { Client } = require("pg");
const { DB_USER, DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD } = require("./env");

const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    password: DB_PASSWORD,
});

const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL database");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = { client, connectDB };
