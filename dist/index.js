"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const couple_routes_1 = __importDefault(require("./routes/couple.routes"));
const diary_routes_1 = __importDefault(require("./routes/diary.routes"));
const memory_routes_1 = __importDefault(require("./routes/memory.routes"));
const socket_1 = require("./socket");
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
/* --------------------------------------------------
   FIXED: Corrected broken CORS origins list
-------------------------------------------------- */
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((url) => url.trim())
        : [
            "http://localhost:3000",
            "https://twospace-ldh2h876w-saurabh-singhs-projects-d3507bc7.vercel.app",
            "https://client2-xi.vercel.app",
            "https://client1-8egw.vercel.app" // ← FIXED: Added comma and removed trailing slash
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
/* --------------------------------------------------
   SOCKET.IO
-------------------------------------------------- */
const io = new socket_io_1.Server(server, { cors: corsOptions });
(0, socket_1.initializeSocket)(io);
/* --------------------------------------------------
   ROUTES
-------------------------------------------------- */
app.get("/", (req, res) => {
    res.send("API is running efficiently... 🚀");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/couple", couple_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.use("/api/memories", memory_routes_1.default);
app.use("/api/diary", diary_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
/* --------------------------------------------------
   ERROR HANDLER
-------------------------------------------------- */
app.use(errorHandler_1.default);
/* --------------------------------------------------
   START SERVER
-------------------------------------------------- */
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server (HTTP + Socket) running on port ${PORT}`);
});
