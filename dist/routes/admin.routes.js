"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Protect ensures they are logged in
// AdminOnly ensures they are YOU
router.get("/stats", authMiddleware_1.protect, adminMiddleware_1.adminOnly, admin_controller_1.getSystemStats);
router.post("/reset-chat", authMiddleware_1.protect, adminMiddleware_1.adminOnly, admin_controller_1.resetChat);
exports.default = router;
