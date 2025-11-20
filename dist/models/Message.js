"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    coupleId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Couple", required: true },
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image"], default: "text" },
}, { timestamps: true });
// Index for fast history fetching (Air Alien Optimization 🚀)
messageSchema.index({ coupleId: 1, createdAt: -1 });
const Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
