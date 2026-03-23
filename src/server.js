const app = require("./app");
const { connectDB } = require("./config/db");
const { PORT } = require("./config/env");
const { NotFoundError } = require("./utils/errors");

const startServer = async () => {
    // Connect to database first
    await connectDB();

    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API base: http://localhost:${PORT}/api/v1`);
        console.log(`NODE_ENV: ${process.env.NODE_ENV || "development"}`);
    });
};

startServer();
console.log("TEST", new NotFoundError())