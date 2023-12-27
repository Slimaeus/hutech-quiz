import { Socket } from "socket.io";
import { NextFunction } from "express";
import SocketHandler from "./socketHandler";
import { Account } from "../../models/account";

class QuizzesSocket implements SocketHandler {
  handleConnection(socket: Socket) {
    socket.emit("ping", "Hi! I am a live socket connection");
    console.log(socket.id);
    const user = socket["user"] as Account;
    socket.emit("load_id", user.id);
  }

  middlewareImplementation(socket: Socket, next: NextFunction) {
    socket
      .on("join_room", ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        socket.to(roomId).emit("joined_room", socket.id);
        console.info(`User: ${socket.id} joined room ${roomId}`);
      })
      .on("leave_room", ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        socket.to(roomId).emit("left_room", socket.id);
        console.info(`User: ${socket.id} left room ${roomId}`);
      });
    return next();
  }
}

export default QuizzesSocket;
