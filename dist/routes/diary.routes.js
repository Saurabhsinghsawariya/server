"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diary_controller_1 = require("../controllers/diary.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.protect, diary_controller_1.getEntries);
router.post("/", authMiddleware_1.protect, diary_controller_1.createEntry);
router.delete("/:id", authMiddleware_1.protect, diary_controller_1.deleteEntry);
exports.default = router;
