const { NotFoundError } = require("../utils/errors");

const notFound = (req, res, next) => {
    next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
