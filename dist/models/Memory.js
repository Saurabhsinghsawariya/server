"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const memorySchema = new mongoose_1.default.Schema({
    coupleId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Couple", required: true },
    uploaderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true }, // Needed to delete image later
    caption: { type: String, default: "" },
}, { timestamps: true });
const Memory = mongoose_1.default.model("Memory", memorySchema);
exports.default = Memory;
