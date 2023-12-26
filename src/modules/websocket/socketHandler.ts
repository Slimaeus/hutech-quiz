import { Socket } from "socket.io";

interface SocketHandler {
  handleConnection(socket: Socket): void;
  middlewareImplementation?(soccket: Socket, next: any): void;
}

export default SocketHandler;
