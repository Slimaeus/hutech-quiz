"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rooms_events_1 = require("../../libs/events/rooms.events");
const sockets_events_1 = require("../../libs/events/sockets.events");
class QuizzesSocket {
    handleConnection(socket) {
        console.info("Quizzes namespace is working...");
        socket.emit(sockets_events_1.SocketsEvents.STARTED, "Quizzes namespace is working...");
        const user = socket["user"];
        socket.emit("load_id", user.id);
    }
    middlewareImplementation(socket, next) {
        socket
            .on(rooms_events_1.RoomsEvents.JOIN_ROOM, ({ roomId }) => {
            socket.join(roomId);
            socket.to(roomId).emit(rooms_events_1.RoomsEvents.JOINED_ROOM, socket["user"]);
            console.info(`User: ${socket.id} joined room ${roomId}`);
        })
            .on(rooms_events_1.RoomsEvents.LEAVE_ROOM, ({ roomId }) => {
            socket.leave(roomId);
            socket.to(roomId).emit(rooms_events_1.RoomsEvents.LEFT_ROOM, socket["user"]);
            console.info(`User: ${socket.id} left room ${roomId}`);
        });
        return next();
    }
}
exports.default = QuizzesSocket;
//# sourceMappingURL=quizzes.socket.js.map