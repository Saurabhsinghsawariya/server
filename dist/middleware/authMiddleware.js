"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // 1. Read the token from the Authorization Header (Bearer schema)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header ("Bearer <token>")
            token = req.headers.authorization.split(" ")[1];
            // 2. Verify the token
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in .env");
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // 3. Attach user info to request
            // Note: We attach the decoded payload directly to save a DB call here.
            // The controllers will fetch the fresh User from DB if needed.
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                name: decoded.name,
                coupleId: decoded.coupleId,
            };
            next();
        }
        catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});
exports.protect = protect;
