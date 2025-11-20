"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    coupleId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Couple", default: null },
    avatarUrl: { type: String, default: "" },
}, { timestamps: true } // Adds createdAt and updatedAt automatically
);
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
