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
exports.resetChat = exports.getSystemStats = void 0;
const Couple_1 = __importDefault(require("../models/Couple"));
const DiaryEntry_1 = __importDefault(require("../models/DiaryEntry"));
const Memory_1 = __importDefault(require("../models/Memory"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
// @desc    Get System Stats
// @route   GET /api/admin/stats
const getSystemStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield User_1.default.countDocuments();
        const messageCount = yield Message_1.default.countDocuments();
        const coupleCount = yield Couple_1.default.countDocuments();
        const memoryCount = yield Memory_1.default.countDocuments();
        const diaryCount = yield DiaryEntry_1.default.countDocuments();
        res.json({
            users: userCount,
            messages: messageCount,
            couples: coupleCount,
            memories: memoryCount,
            diaryEntries: diaryCount,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSystemStats = getSystemStats;
// @desc    NUCLEAR OPTION: Reset Messages & Chat
// @route   POST /api/admin/reset-chat
const resetChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Deletes all messages but keeps users/couples intact
        yield Message_1.default.deleteMany({});
        res.json({ message: "💥 Chat History Wiped Successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.resetChat = resetChat;
