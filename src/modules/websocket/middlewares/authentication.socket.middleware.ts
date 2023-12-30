import { Middleware, MiddlewareInterface } from "socket-controllers";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { QuizzesSocketController } from "../quizzes.socket.controller";
import { Socket } from "socket.io";
import { NextFunction } from "express";
import axios from "axios";
import { User } from "../../../models/user";
import { UnauthorizedError } from "routing-controllers";

const env = process.env.NODE_ENV || "development";
const isTest = env == "development";

@Middleware({ namespace: QuizzesSocketController.namespace })
@Service()
export class AuthenticationMiddleware implements MiddlewareInterface {
  async use(socket: Socket, next: NextFunction) {
    try {
      const token = socket.handshake.query["access_token"] as string;
      if (!token) return next();
      
      const decoded = jwt.verify(token, process.env.TOKEN_KEY, {
        algorithms: ["HS256"],
        ignoreExpiration: isTest,
      });

      const response = await axios.get<User>(
        `${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users/@me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 400) {
        socket["user"] = response.data;
      } else {
        console.error("Get data failed", response.status);
        throw new UnauthorizedError();
      }

      // ! Ignore Expiration is on

      // socket["user"] = Account.fromJson(decoded as jwt.JwtPayload);

      return next();
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
}
