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
Object.defineProperty(exports, "__esModule", { value: true });
const rooms_events_1 = require("../../libs/events/rooms.events");
const sockets_events_1 = require("../../libs/events/sockets.events");
const rooms_service_1 = require("../../libs/services/rooms.service");
const room_1 = require("../../models/room");
class QuizzesSocket {
    handleConnection(socket) {
        console.info("Quizzes namespace is working...");
        socket.emit(sockets_events_1.SocketsEvents.STARTED, "Quizzes namespace is working...");
        const user = socket["user"];
        socket.emit("load_user", user);
    }
    middlewareImplementation(socket, next) {
        socket
            .on(rooms_events_1.RoomsEvents.JOIN_ROOM, ({ roomId }) => __awaiter(this, void 0, void 0, function* () {
            const roomsService = new rooms_service_1.RoomsService();
            const user = socket["user"];
            var room = yield roomsService.get(roomId);
            if (!room)
                return;
            var roomFormValues = room_1.RoomFormValues.toFormValues(room);
            if (!roomFormValues.userIds.includes(user.id))
                roomFormValues.userIds.push(user.id);
            yield roomsService.update(roomId, roomFormValues);
            socket.join(roomId);
            socket.to(roomId).emit(rooms_events_1.RoomsEvents.JOINED_ROOM, user);
            console.info(`User: ${user.userName} joined room ${roomId}`);
        }))
            .on(rooms_events_1.RoomsEvents.LEAVE_ROOM, ({ roomId }) => __awaiter(this, void 0, void 0, function* () {
            const roomsService = new rooms_service_1.RoomsService();
            const user = socket["user"];
            var room = yield roomsService.get(roomId);
            if (!room)
                return;
            var roomFormValues = room_1.RoomFormValues.toFormValues(room);
            roomFormValues.userIds = roomFormValues.userIds.filter(x => x !== user.id);
            yield roomsService.update(roomId, roomFormValues);
            socket.leave(roomId);
            socket.to(roomId).emit(rooms_events_1.RoomsEvents.LEFT_ROOM, user);
            console.info(`User: ${user.userName} left room ${roomId}`);
        }));
        return next();
    }
}
exports.default = QuizzesSocket;
//# sourceMappingURL=quizzes.socket.js.map