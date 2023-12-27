require("dotenv").config();
import { createServer } from "http";
import "reflect-metadata";
import jwt from "jsonwebtoken";

import {
  Action,
  createExpressServer,
  RoutingControllersOptions,
} from "routing-controllers";
import Websocket from "./websocket/webSocket";
import QuizzesSocket from "./websocket/quizzes.socket";
import { Socket } from "socket.io";
import { NextFunction } from "express";

const port = process.env.APP_PORT || 3000;

const routingControllerOptions: RoutingControllersOptions = {
  routePrefix: "",
  controllers: [`${__dirname}/http/*.controller.*`],
  validation: true,
  classTransformer: true,
  cors: false,
  defaultErrorHandler: true,
  authorizationChecker: async (action: Action, roles: string[]) => {
    const authorizationHeader : string = action.request.headers["authorization"];
    const scheme = "bearer";
    const isTest = true;
    if (isTest) return isTest;
    if (!authorizationHeader || !authorizationHeader.toLowerCase().startsWith(scheme)) {
      return false;
    }

    const token : string = authorizationHeader.substring(scheme.length).trim();

    if (!token) return false;

    try {
      // Verify the token using the same key and algorithm used in your ASP.NET Core app
      const decoded = jwt.verify(token, process.env.TOKEN_KEY, {
        algorithms: ["HS256"],
      });

      console.log(decoded);

      // Check if the decoded token has the necessary roles
      // You might want to customize this part based on your token structure
      // const userRoles = decoded.roles || [];
      // const hasRequiredRoles = roles.every(role => userRoles.includes(role));

      return true;
    } catch (error) {
      // Token is invalid or expired
      return false;
    }
  },
};

const app = createExpressServer(routingControllerOptions,);

const httpServer = createServer(app);

httpServer.listen(port, () => {
  console.log(`This is working in port ${port}`);
});

const io = Websocket.getInstance(httpServer);

// io.use((socket, next) => {
//   try {
//     console.log("Hello")
//   const token = socket.handshake.auth.token;
//   console.info(`Token: ${token}`)
  
//   return next();
//   } catch (error) {
//     console.error(error)
//     return next(error);
//   }
// })

io.initializeHandlers([
  { path: '/hubs/quizzes', handler: new QuizzesSocket(), isAuthorized: true }
]);