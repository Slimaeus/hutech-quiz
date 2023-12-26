"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuizzesSocket {
    handleConnection(socket) {
        socket.emit("ping", "Hi! I am a live socket connection");
    }
    middlewareImplementation(socket, next) {
        return next();
    }
}
exports.default = QuizzesSocket;
//# sourceMappingURL=quizzes.socket.js.map