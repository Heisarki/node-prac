class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.name = "AppError";
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = "ValidationError";
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
        this.name = "NotFoundError";
    }
}

module.exports = { AppError, ValidationError, NotFoundError };
