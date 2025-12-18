const errorHandler = (err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);

    // Map business logic errors to appropriate HTTP status codes
    let statusCode = 400; // Bad Request by default

    const forbiddenMessages = [
        "limit (3 books) reached",
        "unpaid fines",
        "suspended",
        "unavailable"
    ];

    if (forbiddenMessages.some(msg => err.message.toLowerCase().includes(msg))) {
        statusCode = 403; // Forbidden
    } else if (err.message.includes("not found")) {
        statusCode = 404; // Not Found
    }

    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;