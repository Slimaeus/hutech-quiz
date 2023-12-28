import { Socket } from "socket.io";
import { NextFunction } from "express";
import SocketHandler from "./socketHandler";
import { Account } from "../../models/account";
import { RoomsEvents } from "../../libs/events/rooms.events";
import { SocketsEvents } from "../../libs/events/sockets.events";

class QuizzesSocket implements SocketHandler {
  handleConnection(socket: Socket) {
    console.info("Quizzes namespace is working...")
    socket.emit(SocketsEvents.STARTED, "Quizzes namespace is working...");
    const user = socket["user"] as Account;
    socket.emit("load_user", user);
  }

  middlewareImplementation(socket: Socket, next: NextFunction) {
    socket
      .on(RoomsEvents.JOIN_ROOM, ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        socket.to(roomId).emit(RoomsEvents.JOINED_ROOM, socket["user"]);
        console.info(`User: ${socket.id} joined room ${roomId}`);
      })
      .on(RoomsEvents.LEAVE_ROOM, ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        socket.to(roomId).emit(RoomsEvents.LEFT_ROOM, socket["user"]);
        console.info(`User: ${socket.id} left room ${roomId}`);
      });
    return next();
  }
}

export default QuizzesSocket;
