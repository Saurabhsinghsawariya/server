"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const diaryEntrySchema = new mongoose_1.default.Schema({
    coupleId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Couple", required: true },
    authorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, default: "😊" }, // Emojis: 😊, 😢, ❤️, 🔥, 😴
    date: { type: Date, default: Date.now },
}, { timestamps: true });
const DiaryEntry = mongoose_1.default.model("DiaryEntry", diaryEntrySchema);
exports.default = DiaryEntry;
