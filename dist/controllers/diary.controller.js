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
exports.deleteEntry = exports.createEntry = exports.getEntries = void 0;
const DiaryEntry_1 = __importDefault(require("../models/DiaryEntry"));
const socket_1 = require("../socket"); // <--- Import
const getEntries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const coupleId = req.user.coupleId;
        const entries = yield DiaryEntry_1.default.find({ coupleId })
            .sort({ date: -1 })
            .populate("authorId", "name");
        res.json(entries);
    }
    catch (error) {
        next(error);
    }
});
exports.getEntries = getEntries;
const createEntry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, mood, date } = req.body;
        // @ts-ignore
        const user = req.user;
        const entry = yield DiaryEntry_1.default.create({
            coupleId: user.coupleId,
            authorId: user._id,
            title,
            content,
            mood,
            date: date || Date.now(),
        });
        // 🔔 NOTIFY EVERYONE
        try {
            (0, socket_1.getIO)().to(user.coupleId.toString()).emit("refreshDiary");
        }
        catch (e) { }
        res.status(201).json(entry);
    }
    catch (error) {
        next(error);
    }
});
exports.createEntry = createEntry;
const deleteEntry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // @ts-ignore
        const user = req.user; // Need user to get coupleId for room emission
        yield DiaryEntry_1.default.findByIdAndDelete(id);
        // 🔔 NOTIFY EVERYONE OF DELETION
        try {
            (0, socket_1.getIO)().to(user.coupleId.toString()).emit("refreshDiary");
        }
        catch (e) { }
        res.json({ message: "Entry deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteEntry = deleteEntry;
