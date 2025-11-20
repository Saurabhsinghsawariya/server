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
exports.getMessages = void 0;
const Message_1 = __importDefault(require("../models/Message"));
// @desc    Get Chat History
// @route   GET /api/chat/:coupleId
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { coupleId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 50; // Load 50 messages at a time
        const messages = yield Message_1.default.find({ coupleId })
            .sort({ createdAt: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("senderId", "name avatarUrl");
        // Reverse to show oldest -> newest in the UI
        res.json(messages.reverse());
    }
    catch (error) {
        next(error);
    }
});
exports.getMessages = getMessages;
