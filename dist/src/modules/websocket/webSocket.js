"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Websocket_1;
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http = require("http");
const typedi_1 = require("typedi");
const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"],
};
let Websocket = Websocket_1 = class Websocket extends socket_io_1.Server {
    constructor(httpServer) {
        super(httpServer, {
            cors: WEBSOCKET_CORS,
        });
    }
    static getInstance(httpServer) {
        if (!Websocket_1.io) {
            Websocket_1.io = new Websocket_1(httpServer);
        }
        return Websocket_1.io;
    }
};
Websocket = Websocket_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [http.Server])
], Websocket);
exports.default = Websocket;
//# sourceMappingURL=webSocket.js.map