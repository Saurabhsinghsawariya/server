"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const memory_controller_1 = require("../controllers/memory.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Store file in memory (RAM) temporarily
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/upload", authMiddleware_1.protect, upload.single("file"), memory_controller_1.uploadMemory);
router.get("/", authMiddleware_1.protect, memory_controller_1.getMemories);
exports.default = router;
