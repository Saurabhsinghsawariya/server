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
exports.getIO = exports.initializeSocket = void 0;
const Message_1 = __importDefault(require("./models/Message"));
// 1. Create a variable to hold the IO instance
let ioInstance;
const initializeSocket = (io) => {
    ioInstance = io; // Store it
    io.on("connection", (socket) => {
        console.log(`⚡ Client connected: ${socket.id}`);
        socket.on("joinRoom", (coupleId) => {
            socket.join(coupleId);
            // console.log(`User joined room: ${coupleId}`);
        });
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { coupleId, senderId, content } = data;
            try {
                const newMessage = yield Message_1.default.create({ coupleId, senderId, content });
                yield newMessage.populate("senderId", "name");
                io.to(coupleId).emit("newMessage", newMessage);
            }
            catch (error) {
                console.error("Socket Error:", error);
            }
        }));
        socket.on("sendHeart", (coupleId) => {
            io.to(coupleId).emit("showHeart");
        });
        socket.on("disconnect", () => { });
    });
};
exports.initializeSocket = initializeSocket;
// 2. Export a function to get the IO instance anywhere
const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized!");
    }
    return ioInstance;
};
exports.getIO = getIO;
