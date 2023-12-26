import { Server, Socket } from "socket.io";
import http = require("http");
import SocketHandler from "./socketHandler";

const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

class Websocket extends Server {
  private static io: Websocket;

  constructor(httpServer: http.Server) {
    super(httpServer, {
      cors: WEBSOCKET_CORS,
    });
  }

  public static getInstance(httpServer?: http.Server): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer!);
    }

    return Websocket.io;
  }

  public initializeHandlers(
    socketHandlers: Array<{ path: string; handler: SocketHandler }>
  ) {
    socketHandlers.forEach((element) => {
      let namespace = Websocket.io.of(element.path, (socket: Socket) => {
        element.handler.handleConnection(socket);
      });

      if (element.handler.middlewareImplementation) {
        namespace.use(element.handler.middlewareImplementation);
      }
    });
  }
}

export default Websocket;
