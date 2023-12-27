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
require("dotenv").config();
const http_1 = require("http");
require("reflect-metadata");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const routing_controllers_1 = require("routing-controllers");
const webSocket_1 = __importDefault(require("./websocket/webSocket"));
const quizzes_socket_1 = __importDefault(require("./websocket/quizzes.socket"));
const port = process.env.APP_PORT || 3000;
const routingControllerOptions = {
    routePrefix: "",
    controllers: [`${__dirname}/http/*.controller.*`],
    validation: true,
    classTransformer: true,
    cors: false,
    defaultErrorHandler: true,
    authorizationChecker: (action, roles) => __awaiter(void 0, void 0, void 0, function* () {
        const authorizationHeader = action.request.headers["authorization"];
        const scheme = "bearer";
        const isTest = true;
        if (isTest)
            return isTest;
        if (!authorizationHeader || !authorizationHeader.toLowerCase().startsWith(scheme)) {
            return false;
        }
        const token = authorizationHeader.substring(scheme.length).trim();
        if (!token)
            return false;
        try {
            // Verify the token using the same key and algorithm used in your ASP.NET Core app
            const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY, {
                algorithms: ["HS256"],
            });
            console.log(decoded);
            // Check if the decoded token has the necessary roles
            // You might want to customize this part based on your token structure
            // const userRoles = decoded.roles || [];
            // const hasRequiredRoles = roles.every(role => userRoles.includes(role));
            return true;
        }
        catch (error) {
            // Token is invalid or expired
            return false;
        }
    }),
};
const app = (0, routing_controllers_1.createExpressServer)(routingControllerOptions);
const httpServer = (0, http_1.createServer)(app);
httpServer.listen(port, () => {
    console.log(`This is working in port ${port}`);
});
const io = webSocket_1.default.getInstance(httpServer);
io.use((socket, next) => {
    try {
        console.log("Hello");
        const token = socket.handshake.auth.token;
        console.info(`Token: ${token}`);
        return next();
    }
    catch (error) {
        console.error(error);
    }
});
io.initializeHandlers([
    { path: '/hubs/quizzes', handler: new quizzes_socket_1.default() }
]);
//# sourceMappingURL=server.js.map