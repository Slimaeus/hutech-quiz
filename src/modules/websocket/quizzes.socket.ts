import { Socket } from "socket.io";
import { NextFunction } from "express";
import SocketHandler from "./socketHandler";

class QuizzesSocket implements SocketHandler {
  handleConnection(socket: Socket) {
    socket.emit("ping", "Hi! I am a live socket connection");
    console.log(socket.id);
    socket.emit("load_id", socket.id);
  }

  middlewareImplementation(socket: Socket, next: NextFunction) {
    socket
      .on("join_room", ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        console.info(`User: ${socket.id} joined room ${roomId}`);
      })
      .on("leave_room", ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        console.info(`User: ${socket.id} left room ${roomId}`);
      });
    return next();
  }
}

export default QuizzesSocket;
