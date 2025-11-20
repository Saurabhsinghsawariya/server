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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const fixDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔧 Connecting to MongoDB...");
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connected.");
        console.log("🗑️ Attempting to delete the bad 'inviteCode' index...");
        // This command forces MongoDB to delete the strict rule
        try {
            yield mongoose_1.default.connection.collection("couples").dropIndex("inviteCode_1");
            console.log("🎉 SUCCESS: The bad index was deleted!");
        }
        catch (err) {
            if (err.code === 27) {
                console.log("ℹ️ Index not found (It might be already fixed).");
            }
            else {
                console.error("⚠️ Error dropping index:", err.message);
            }
        }
        // Optional: Clear broken data just to be safe
        // await mongoose.connection.collection("couples").deleteMany({});
        // await mongoose.connection.collection("users").deleteMany({});
        // console.log("🧹 Cleaned up old data.");
    }
    catch (error) {
        console.error("❌ Connection Error:", error);
    }
    finally {
        console.log("👋 Closing connection.");
        yield mongoose_1.default.connection.close();
        process.exit();
    }
});
fixDatabase();
