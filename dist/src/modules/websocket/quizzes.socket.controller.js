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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesSocketController = void 0;
const socket_controllers_1 = require("socket-controllers");
const typedi_1 = require("typedi");
const rooms_service_1 = require("../../libs/services/rooms.service");
const room_1 = require("../../models/room");
const rooms_events_1 = require("../../libs/events/rooms.events");
const sockets_events_1 = require("../../libs/events/sockets.events");
const socket_io_1 = require("socket.io");
let QuizzesSocketController = class QuizzesSocketController {
    constructor(injectedRoomsService) {
        this.injectedRoomsService = injectedRoomsService;
        this.roomsService = injectedRoomsService;
    }
    connection(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomsService = new rooms_service_1.RoomsService();
            const user = socket["user"];
            console.info("Quizzes namespace is working...");
            socket.emit(sockets_events_1.SocketsEvents.STARTED, "Quizzes namespace is working...");
            socket.emit("load_user", user);
            const roomCodeParam = socket.handshake.query["roomCode"];
            let roomCode = "";
            if (!roomCodeParam)
                return;
            if (Array.isArray(roomCodeParam) &&
                roomCodeParam.every((item) => typeof item === "string")) {
                roomCode = roomCodeParam.join("");
            }
            roomCode = roomCodeParam;
            var room = yield roomsService.getByCode(roomCode);
            if (!room)
                return;
            var roomFormValues = room_1.RoomFormValues.toFormValues(room);
            if (!roomFormValues.userIds.includes(user.id))
                roomFormValues.userIds.push(user.id);
            yield roomsService.update(room.id, roomFormValues);
            socket.join(roomCode);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.JOINED_ROOM, user);
            console.info(`User: ${user.userName} joined room ${roomCode}`);
        });
    }
    disconnect(socket) {
        console.info("client disconnected");
    }
    joinRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            var room = yield this.roomsService.getByCode(roomCode);
            if (!room)
                return;
            var roomFormValues = room_1.RoomFormValues.toFormValues(room);
            if (!roomFormValues.userIds.includes(user.id))
                roomFormValues.userIds.push(user.id);
            yield this.roomsService.update(room.id, roomFormValues);
            socket.join(roomCode);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.JOINED_ROOM, user);
            console.info(`User: ${user.userName} joined room ${roomCode}`);
        });
    }
    leaveRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            var room = yield this.roomsService.getByCode(roomCode);
            if (!room)
                return;
            var roomFormValues = room_1.RoomFormValues.toFormValues(room);
            roomFormValues.userIds = roomFormValues.userIds.filter((x) => x !== user.id);
            yield this.roomsService.update(room.id, roomFormValues);
            socket.leave(roomCode);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.LEFT_ROOM, user);
            console.info(`User: ${user.userName} left room ${roomCode}`);
        });
    }
    startRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            var room = yield this.roomsService.getByCode(roomCode);
            if (!room || !room.ownerId || room.ownerId !== user.id)
                return;
            yield this.roomsService.start(room.id);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.STARTED_ROOM, room.id);
            console.info(`User: ${user.userName} start room ${roomCode}`);
        });
    }
    endRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            var room = yield this.roomsService.getByCode(roomCode);
            if (!room || !room.ownerId || room.ownerId !== user.id)
                return;
            yield this.roomsService.end(room.id);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.ENDED_ROOM, room.id);
            console.info(`User: ${user.userName} start room ${roomCode}`);
        });
    }
};
exports.QuizzesSocketController = QuizzesSocketController;
QuizzesSocketController.namespace = "/hubs/quizzes";
__decorate([
    (0, socket_controllers_1.OnConnect)(),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], QuizzesSocketController.prototype, "connection", null);
__decorate([
    (0, socket_controllers_1.OnDisconnect)(),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], QuizzesSocketController.prototype, "disconnect", null);
__decorate([
    (0, socket_controllers_1.OnMessage)(rooms_events_1.RoomsEvents.JOIN_ROOM),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __param(1, (0, socket_controllers_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], QuizzesSocketController.prototype, "joinRoom", null);
__decorate([
    (0, socket_controllers_1.OnMessage)(rooms_events_1.RoomsEvents.LEAVE_ROOM),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __param(1, (0, socket_controllers_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], QuizzesSocketController.prototype, "leaveRoom", null);
__decorate([
    (0, socket_controllers_1.OnMessage)(rooms_events_1.RoomsEvents.START_ROOM),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __param(1, (0, socket_controllers_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], QuizzesSocketController.prototype, "startRoom", null);
__decorate([
    (0, socket_controllers_1.OnMessage)(rooms_events_1.RoomsEvents.END_ROOM),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __param(1, (0, socket_controllers_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], QuizzesSocketController.prototype, "endRoom", null);
exports.QuizzesSocketController = QuizzesSocketController = __decorate([
    (0, socket_controllers_1.SocketController)(QuizzesSocketController.namespace),
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], QuizzesSocketController);
//# sourceMappingURL=quizzes.socket.controller.js.map