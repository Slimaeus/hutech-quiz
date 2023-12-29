"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AuthenticationMiddleware = void 0;
const socket_controllers_1 = require("socket-controllers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typedi_1 = require("typedi");
const quizzes_socket_controller_1 = require("../quizzes.socket.controller");
const axios_1 = __importDefault(require("axios"));
const routing_controllers_1 = require("routing-controllers");
let AuthenticationMiddleware = class AuthenticationMiddleware {
    use(socket, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield axios_1.default.get(`${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users/@me`, {
                    headers: {
                        Authorization: `Bearer ${tokenStr}`,
                    },
                });
                if (response.status < 400) {
                    socket["user"] = response.data;
                }
                else {
                    console.error("Get data failed", response.status, response.data);
                    throw new routing_controllers_1.UnauthorizedError();
                }
                // ! Ignore Expiration is on
                // socket["user"] = Account.fromJson(decoded as jwt.JwtPayload);
                return next();
            }
            catch (error) {
                console.error(error);
                return next(error);
            }
        });
    }
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
exports.AuthenticationMiddleware = AuthenticationMiddleware = __decorate([
    (0, socket_controllers_1.Middleware)({ namespace: quizzes_socket_controller_1.QuizzesSocketController.namespace }),
    (0, typedi_1.Service)()
], AuthenticationMiddleware);
//# sourceMappingURL=authentication.socket.middleware.js.map