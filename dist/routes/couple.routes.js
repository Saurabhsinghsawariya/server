"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couple_controller_1 = require("../controllers/couple.controller");
const authMiddleware_1 = require("../middleware/authMiddleware"); // We will create this next
const router = express_1.default.Router();
router.get("/me", authMiddleware_1.protect, couple_controller_1.getMyStatus);
router.post("/generate", authMiddleware_1.protect, couple_controller_1.generateInvite);
router.post("/join", authMiddleware_1.protect, couple_controller_1.joinCouple);
exports.default = router;
