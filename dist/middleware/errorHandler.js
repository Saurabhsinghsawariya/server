"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    // Log the error for the developer
    console.error(err.stack);
    // Send a generic message to the client (don't leak stack traces in prod)
    res.status(500).json({
        message: err.message || "Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
exports.default = errorHandler;
