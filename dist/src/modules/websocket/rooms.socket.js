"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomsSocket {
    handleConnection(socket) {
        console.info("Rooms namespace is working...");
        socket.emit("socket", "Rooms");
        const user = socket["user"];
        socket.emit("load_id", user.id);
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
exports.default = RoomsSocket;
//# sourceMappingURL=rooms.socket.js.map