"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuizzesSocket {
    handleConnection(socket) {
        socket.emit("ping", "Hi! I am a live socket connection");
        console.log(socket.id);
        socket.emit("load_id", socket.id);
    }
    middlewareImplementation(socket, next) {
        socket
            .on("join_room", ({ roomId }) => {
            socket.join(roomId);
            socket.to(roomId).emit("joined_room", socket.id);
            console.info(`User: ${socket.id} joined room ${roomId}`);
        })
            .on("leave_room", ({ roomId }) => {
            socket.leave(roomId);
            socket.to(roomId).emit("left_room", socket.id);
            console.info(`User: ${socket.id} left room ${roomId}`);
        });
        return next();
    }
}
exports.default = QuizzesSocket;
//# sourceMappingURL=quizzes.socket.js.map