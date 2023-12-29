require("dotenv").config();
import { createServer } from "http";
import "reflect-metadata";
import jwt from "jsonwebtoken";

import {
  Action,
  createExpressServer,
  RoutingControllersOptions,
  useContainer,
} from "routing-controllers";
import Websocket from "./websocket/webSocket";
import { Account } from "../models/account";
import Container from "typedi";
import { SocketControllers } from "socket-controllers";

const port = process.env.APP_PORT || 3000;

const routingControllerOptions: RoutingControllersOptions = {
  routePrefix: "",
  controllers: [`${__dirname}/http/*.controller.*`],
  validation: true,
  classTransformer: true,
  cors: false,
  defaultErrorHandler: true,
  currentUserChecker: (action: Action) => {
    const authorizationHeader: string = action.request.headers["authorization"];
    const scheme = "bearer";
    // const isTest = true;
    // if (isTest) return isTest;
    if (
      !authorizationHeader ||
      !authorizationHeader.toLowerCase().startsWith(scheme)
    ) {
      return false;
    }

    const token: string = authorizationHeader.substring(scheme.length).trim();

    if (!token) return false;

    try {
      // Verify the token using the same key and algorithm used in your ASP.NET Core app
      const decoded = jwt.verify(token, process.env.TOKEN_KEY, {
        algorithms: ["HS256"],
        ignoreExpiration: true,
      });

      return Account.fromJson(decoded as jwt.JwtPayload);
    } catch (error) {
      // Token is invalid or expired
      return undefined;
    }
  },
  authorizationChecker: async (action: Action, roles: string[]) => {
    const authorizationHeader: string = action.request.headers["authorization"];
    const scheme = "bearer";
    const isTest = true;
    if (isTest) return isTest;
    if (
      !authorizationHeader ||
      !authorizationHeader.toLowerCase().startsWith(scheme)
    ) {
      return false;
    }

    const token: string = authorizationHeader.substring(scheme.length).trim();

    if (!token) return false;

    try {
      // Verify the token using the same key and algorithm used in your ASP.NET Core app
      const decoded = jwt.verify(token, process.env.TOKEN_KEY, {
        algorithms: ["HS256"],
      });

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

useContainer(Container);

const app = createExpressServer(routingControllerOptions);

const httpServer = createServer(app);

httpServer.listen(port, () => {
  console.log(`This is working in port ${port}`);
});

const io = Websocket.getInstance(httpServer);
Container.set(Websocket, io);

new SocketControllers({
  io,
  container: Container,
  controllers: [`${__dirname}/websocket/*.socket.controller.*`],
  middlewares: [`${__dirname}/websocket/middlewares/*.socket.middleware.*`],
});
