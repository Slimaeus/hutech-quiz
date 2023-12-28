"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = require("../../models/account");
const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"],
};
class Websocket extends socket_io_1.Server {
    constructor(httpServer) {
        super(httpServer, {
            cors: WEBSOCKET_CORS,
        });
    }
    static getInstance(httpServer) {
        if (!Websocket.io) {
            Websocket.io = new Websocket(httpServer);
        }
        return Websocket.io;
    }
    initializeHandlers(socketHandlers) {
        socketHandlers.forEach((element) => {
            let namespace = Websocket.io.of(element.path, (socket) => {
                element.handler.handleConnection(socket);
            });
            if (element.handler.middlewareImplementation) {
                if (element.isAuthorized)
                    namespace.use((socket, next) => {
                        try {
                            const token = socket.handshake.query["access_token"];
                            let tokenStr = "";
                            if (!token)
                                return next();
                            if (Array.isArray(token) &&
                                token.every((item) => typeof item === "string")) {
                                tokenStr = token.join("");
                            }
                            tokenStr = token;
                            console.info(`Token: ${tokenStr}`);
                            const decoded = jsonwebtoken_1.default.verify(tokenStr, process.env.TOKEN_KEY, {
                                algorithms: ["HS256"],
                            });
                            console.log(`Decoded: `);
                            console.log(decoded);
                            socket["user"] = account_1.Account.fromJson(decoded);
                            console.log(`User: `);
                            console.log(socket["user"]);
                            return next();
                        }
                        catch (error) {
                            console.error(error);
                            return next(error);
                        }
                    });
                namespace.use(element.handler.middlewareImplementation);
            }
        });
    }
}
exports.default = Websocket;
//# sourceMappingURL=webSocket.js.map