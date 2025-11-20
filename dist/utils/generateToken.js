"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    // Set HTTP-Only Cookie (The "Air Alien" Security Layer)
    res.cookie("jwt", token, {
        httpOnly: true, // Client-side JS cannot read this (Prevents XSS)
        // 🛠️ FIX FOR DEPLOYMENT: 'none' is required for cross-site cookies, 
        // but browsers require 'secure: true' when sameSite is 'none'.
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};
exports.default = generateToken;
