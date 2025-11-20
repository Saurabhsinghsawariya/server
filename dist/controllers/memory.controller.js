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
exports.getMemories = exports.uploadMemory = void 0;
const stream_1 = __importDefault(require("stream"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const Memory_1 = __importDefault(require("../models/Memory"));
const socket_1 = require("../socket"); // <--- Import this
const uploadMemory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error("No file uploaded");
        }
        // @ts-ignore
        const user = req.user;
        const uploadStream = () => {
            return new Promise((resolve, reject) => {
                const theStream = cloudinary_1.default.uploader.upload_stream({ folder: "twospace_memories" }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                const bufferStream = new stream_1.default.PassThrough();
                // @ts-ignore
                bufferStream.end(req.file.buffer);
                bufferStream.pipe(theStream);
            });
        };
        const result = yield uploadStream();
        const newMemory = yield Memory_1.default.create({
            coupleId: user.coupleId,
            uploaderId: user._id,
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });
        // 🔔 NOTIFY EVERYONE IN THE COUPLE
        try {
            (0, socket_1.getIO)().to(user.coupleId.toString()).emit("refreshMemories");
        }
        catch (e) {
            console.error("Socket emit failed", e);
        }
        res.status(201).json(newMemory);
    }
    catch (error) {
        console.error("Upload Error:", error);
        next(error);
    }
});
exports.uploadMemory = uploadMemory;
const getMemories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const coupleId = req.user.coupleId;
        const memories = yield Memory_1.default.find({ coupleId }).sort({ createdAt: -1 });
        res.json(memories);
    }
    catch (error) {
        next(error);
    }
});
exports.getMemories = getMemories;
