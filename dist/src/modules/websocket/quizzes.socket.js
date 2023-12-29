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
Object.defineProperty(exports, "__esModule", { value: true });
const rooms_events_1 = require("../../libs/events/rooms.events");
const sockets_events_1 = require("../../libs/events/sockets.events");
const rooms_service_1 = require("../../libs/services/rooms.service");
const room_1 = require("../../models/room");
const typedi_1 = require("typedi");
let QuizzesSocket = class QuizzesSocket {
    handleConnection(socket) {
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
    middlewareImplementation(socket, next) {
        socket
            .on(rooms_events_1.RoomsEvents.JOIN_ROOM, ({ roomCode }) => __awaiter(this, void 0, void 0, function* () {
            const roomsService = new rooms_service_1.RoomsService();
            const user = socket["user"];
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
        }))
            .on(rooms_events_1.RoomsEvents.LEAVE_ROOM, ({ roomCode }) => __awaiter(this, void 0, void 0, function* () {
            const roomsService = new rooms_service_1.RoomsService();
            const user = socket["user"];
            var room = yield roomsService.getByCode(roomCode);
            if (!room)
                return;
            var roomFormValues = room_1.RoomFormValues.toFormValues(room);
            roomFormValues.userIds = roomFormValues.userIds.filter((x) => x !== user.id);
            yield roomsService.update(room.id, roomFormValues);
            socket.leave(roomCode);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.LEFT_ROOM, user);
            console.info(`User: ${user.userName} left room ${roomCode}`);
        }))
            .on(rooms_events_1.RoomsEvents.START_ROOM, ({ roomCode }) => __awaiter(this, void 0, void 0, function* () {
            const roomsService = new rooms_service_1.RoomsService();
            const user = socket["user"];
            var room = yield roomsService.getByCode(roomCode);
            if (!room || !room.ownerId || room.ownerId !== user.id)
                return;
            var roomFormValues = room_1.RoomFormValues.toFormValues(room);
            roomFormValues.isStarted = true;
            roomFormValues.startedAt = new Date();
            yield roomsService.update(room.id, roomFormValues);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.STARTED_ROOM, room);
            console.info(`User: ${user.userName} start room ${roomCode}`);
        }));
        return next();
    }
};
QuizzesSocket = __decorate([
    (0, typedi_1.Service)()
], QuizzesSocket);
exports.default = QuizzesSocket;
//# sourceMappingURL=quizzes.socket.js.map