"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/:coupleId", authMiddleware_1.protect, chat_controller_1.getMessages);
exports.default = router;
