import { Server, Socket } from "socket.io";
import http = require("http");
import SocketHandler from "./socketHandler";
import jwt from "jsonwebtoken";
import { Account } from "../../models/account";

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
    socketHandlers: Array<{
      path: string;
      handler: SocketHandler;
      isAuthorized?: boolean;
    }>
  ) {
    socketHandlers.forEach((element) => {
      let namespace = Websocket.io.of(element.path, (socket: Socket) => {
        element.handler.handleConnection(socket);
      });

      if (element.handler.middlewareImplementation) {
        if (element.isAuthorized)
          namespace.use((socket, next) => {
            try {
              const token = socket.handshake.query["access_token"];
              let tokenStr = "";
              if (!token) return next();
              if (
                Array.isArray(token) &&
                token.every((item) => typeof item === "string")
              ) {
                tokenStr = token.join("");
              }
              tokenStr = token as string;
              console.info(`Token: ${tokenStr}`);
              const decoded = jwt.verify(tokenStr, process.env.TOKEN_KEY, {
                algorithms: ["HS256"],
                ignoreExpiration: true,
              });

              console.log(`Decoded: `);
              console.log(decoded);

              socket["user"] = Account.fromJson(decoded as jwt.JwtPayload);

              console.log(`User: `);
              console.log(socket["user"]);

              return next();
            } catch (error) {
              console.error(error);
              return next(error);
            }
          });
        namespace.use(element.handler.middlewareImplementation);
      }
    });
  }
}

export default Websocket;
