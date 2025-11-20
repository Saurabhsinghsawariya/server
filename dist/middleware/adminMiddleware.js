"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const adminOnly = (req, res, next) => {
    // @ts-ignore
    if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
        next(); // You are the chosen one. Proceed.
    }
    else {
        res.status(403); // Forbidden
        throw new Error("⛔ Access Denied: You are not the Admin.");
    }
};
exports.adminOnly = adminOnly;
