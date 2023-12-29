"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = void 0;
const socket_controllers_1 = require("socket-controllers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = require("../../../models/account");
const typedi_1 = require("typedi");
const quizzes_socket_controller_1 = require("../quizzes.socket.controller");
let AuthenticationMiddleware = class AuthenticationMiddleware {
    use(socket, next) {
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
            const decoded = jsonwebtoken_1.default.verify(tokenStr, process.env.TOKEN_KEY, {
                algorithms: ["HS256"],
                ignoreExpiration: true,
            });
            socket["user"] = account_1.Account.fromJson(decoded);
            return next();
        }
        catch (error) {
            console.error(error);
            return next(error);
        }
    }
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
exports.AuthenticationMiddleware = AuthenticationMiddleware = __decorate([
    (0, socket_controllers_1.Middleware)({ namespace: quizzes_socket_controller_1.QuizzesSocketController.namespace }),
    (0, typedi_1.Service)()
], AuthenticationMiddleware);
//# sourceMappingURL=authentication.socket.middleware.js.map