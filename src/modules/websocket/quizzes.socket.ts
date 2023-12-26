import { Socket } from "socket.io";
import { NextFunction } from "express";
import SocketHandler from "./socketHandler";

class QuizzesSocket implements SocketHandler {
  handleConnection(socket: Socket) {
    socket.emit("ping", "Hi! I am a live socket connection");
  }

  middlewareImplementation(socket: Socket, next: NextFunction) {
    return next();
  }
}

export default QuizzesSocket;
