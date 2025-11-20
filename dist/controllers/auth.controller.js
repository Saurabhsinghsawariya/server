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
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const auth_schema_1 = require("../schemas/auth.schema");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Validate Input
        const result = auth_schema_1.RegisterSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400);
            // 🛠 FIX: Use 'issues' instead of 'errors' to satisfy TypeScript
            throw new Error(result.error.issues[0].message);
        }
        const { name, email, password } = result.data;
        // 2. Check if user exists
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        // 3. Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // 4. Create User
        const user = yield User_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        if (user) {
            (0, generateToken_1.default)(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                coupleId: user.coupleId,
            });
        }
        else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = auth_schema_1.LoginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400);
            // 🛠 FIX: Use 'issues' instead of 'errors' here too
            throw new Error(result.error.issues[0].message);
        }
        const { email, password } = result.data;
        const user = yield User_1.default.findOne({ email });
        // 🛡️ Safer Check: Ensure user AND user.password exist
        if (!user || !user.password) {
            res.status(401);
            throw new Error("Invalid email or password");
        }
        if (yield bcryptjs_1.default.compare(password, user.password)) {
            (0, generateToken_1.default)(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                coupleId: user.coupleId,
            });
        }
        else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
// @desc    Logout user / Clear cookie
// @route   POST /api/auth/logout
const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
