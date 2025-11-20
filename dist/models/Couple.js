"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const coupleSchema = new mongoose_1.default.Schema({
    users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    inviteCode: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls if needed
}, { timestamps: true });
const Couple = mongoose_1.default.model("Couple", coupleSchema);
exports.default = Couple;
