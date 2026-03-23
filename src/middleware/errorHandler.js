const errorHandler = (error, req, res, next) => {
    const status = error.status || 500;
    const isDev = process.env.NODE_ENV !== "production";

    res.status(status).json({
        success: false,
        status,
        message: error.message || "Internal Server Error",
        ...(isDev && { stack: error.stack }),
    });
};

module.exports = errorHandler;
