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
const quizzes_events_1 = require("../../libs/events/quizzes.events");
const quizCollections_service_1 = require("../../libs/services/quizCollections.service");
const quizzes_service_1 = require("../../libs/services/quizzes.service");
const records_service_1 = require("../../libs/services/records.service");
const record_1 = require("../../models/record");
let QuizzesSocketController = class QuizzesSocketController {
    constructor(roomsService, quizCollectionsService, quizzesService, recordsService) {
        this.roomsService = roomsService;
        this.quizCollectionsService = quizCollectionsService;
        this.quizzesService = quizzesService;
        this.recordsService = recordsService;
    }
    connection(socket, roomCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            console.info("Quizzes namespace is working...");
            socket.emit(sockets_events_1.SocketsEvents.STARTED, "Quizzes namespace is working...");
            socket.emit("load_user", user);
            // const roomCode = socket.handshake.query.roomCode as string;
            console.log("Room code: ");
            console.log(roomCode);
            if (!roomCode)
                return socket.disconnect();
            const room = yield this.roomsService.getByCode(roomCode);
            if (!room)
                return;
            const roomFormValues = room_1.RoomFormValues.toFormValues(room);
            if (!roomFormValues.userIds.includes(user.id))
                roomFormValues.userIds.push(user.id);
            yield this.roomsService.update(room.id, roomFormValues);
            socket.join(roomCode);
            const quizzes = yield this.quizzesService.getMany({
                collections: {
                    every: {
                        quizCollectionId: room.quizCollectionId,
                    },
                },
            });
            socket.emit(quizzes_events_1.QuizzesEvents.LOADED_QUIZZES, quizzes);
            socket.emit(rooms_events_1.RoomsEvents.JOINED_ROOM, user);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.JOINED_ROOM, user);
            console.info(`User (${user.userName}) joined room ${roomCode}`);
        });
    }
    disconnect(socket) {
        console.info(`User (${socket["user"].userName}) disconnected`);
    }
    joinRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            const room = yield this.roomsService.getByCode(roomCode);
            if (!room)
                return;
            const roomFormValues = room_1.RoomFormValues.toFormValues(room);
            if (!roomFormValues.userIds.includes(user.id))
                roomFormValues.userIds.push(user.id);
            yield this.roomsService.update(room.id, roomFormValues);
            socket.join(roomCode);
            socket.emit(rooms_events_1.RoomsEvents.JOINED_ROOM, user);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.JOINED_ROOM, user);
            console.info(`User (${user.userName}) joined room ${roomCode}`);
        });
    }
    leaveRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            //
            const room = yield this.roomsService.getByCode(roomCode);
            if (!room)
                return;
            const roomFormValues = room_1.RoomFormValues.toFormValues(room);
            roomFormValues.userIds = roomFormValues.userIds.filter((x) => x !== user.id);
            yield this.roomsService.update(room.id, roomFormValues);
            //
            yield this.roomsService.leaveByCode(room.code, user.id);
            socket.leave(roomCode);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.LEFT_ROOM, user);
            console.info(`User (${user.userName}) left room ${roomCode}`);
        });
    }
    startRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            var room = yield this.roomsService.getByCode(roomCode);
            if (!room || !room.ownerId || room.ownerId !== user.id)
                return;
            yield this.roomsService.start(room.id);
            socket.emit(rooms_events_1.RoomsEvents.STARTED_ROOM, room.code);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.STARTED_ROOM, room.code);
            console.info(`User (${user.userName}) start room ${roomCode}`);
        });
    }
    endRoom(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            const room = yield this.roomsService.getByCode(roomCode);
            if (!room || !room.ownerId || room.ownerId !== user.id)
                return;
            yield this.roomsService.end(room.id);
            socket.to(roomCode).emit(rooms_events_1.RoomsEvents.ENDED_ROOM, room.code);
            console.info(`User (${user.userName}) start room ${roomCode}`);
        });
    }
    loadQuiz(socket, { roomCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.roomsService.getByCode(roomCode);
            if (!room)
                return;
            socket.emit(quizzes_events_1.QuizzesEvents.LOADED_CURRENT_QUIZ, room.currentQuiz);
            socket
                .to(room.code)
                .emit(quizzes_events_1.QuizzesEvents.LOADED_CURRENT_QUIZ, room.currentQuiz);
        });
    }
    answerQuiz(socket, roomCode, { quizId, answerId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = socket["user"];
            const room = yield this.roomsService.getByCode(roomCode);
            if (!room)
                return;
            const recordFormValues = new record_1.RecordFormValues();
            recordFormValues.answerId = answerId;
            recordFormValues.quizId = quizId;
            recordFormValues.userId = user.id;
            recordFormValues.roomId = room.id;
            const result = yield this.recordsService.create(recordFormValues);
            const formattedUser = {
                id: user.id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatarUrl: user.avatarUrl,
            };
            result["user"] = formattedUser;
            socket.emit(quizzes_events_1.QuizzesEvents.ANSWERED_QUIZ, result);
            socket.to(room.code).emit(quizzes_events_1.QuizzesEvents.ANSWERED_QUIZ, {
                user: formattedUser,
            });
        });
    }
};
exports.QuizzesSocketController = QuizzesSocketController;
QuizzesSocketController.namespace = "/hubs/quizzes";
__decorate([
    (0, socket_controllers_1.OnConnect)(),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __param(1, (0, socket_controllers_1.SocketQueryParam)("roomCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
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
__decorate([
    (0, socket_controllers_1.OnMessage)(quizzes_events_1.QuizzesEvents.LOAD_CURRENT_QUIZ),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __param(1, (0, socket_controllers_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], QuizzesSocketController.prototype, "loadQuiz", null);
__decorate([
    (0, socket_controllers_1.OnMessage)(quizzes_events_1.QuizzesEvents.ANSWER_QUIZ),
    __param(0, (0, socket_controllers_1.ConnectedSocket)()),
    __param(1, (0, socket_controllers_1.SocketQueryParam)("roomCode")),
    __param(2, (0, socket_controllers_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesSocketController.prototype, "answerQuiz", null);
exports.QuizzesSocketController = QuizzesSocketController = __decorate([
    (0, socket_controllers_1.SocketController)(QuizzesSocketController.namespace),
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        quizCollections_service_1.QuizCollectionsService,
        quizzes_service_1.QuizzesService,
        records_service_1.RecordsService])
], QuizzesSocketController);
