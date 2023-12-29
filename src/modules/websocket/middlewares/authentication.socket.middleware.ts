import { Middleware, MiddlewareInterface } from "socket-controllers";
import jwt from "jsonwebtoken";
import { Account } from "../../../models/account";
import { Service } from "typedi";
import { QuizzesSocketController } from "../quizzes.socket.controller";
import { Socket } from "socket.io";
import { NextFunction } from "express";

@Middleware({ namespace: QuizzesSocketController.namespace })
@Service()
export class AuthenticationMiddleware implements MiddlewareInterface {
  use(socket: Socket, next: NextFunction) {
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
      const decoded = jwt.verify(tokenStr, process.env.TOKEN_KEY, {
        algorithms: ["HS256"],
        ignoreExpiration: true,
      });

      socket["user"] = Account.fromJson(decoded as jwt.JwtPayload);

      return next();
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
}
