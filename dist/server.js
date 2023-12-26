"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const http_1 = require("http");
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const port = process.env.APP_PORT || 3000;
const routingControllerOptions = {
    routePrefix: "v1",
    controllers: [`${__dirname}/http/*.controller.*`],
    validation: true,
    classTransformer: true,
    cors: true,
    defaultErrorHandler: true,
};
const app = (0, routing_controllers_1.createExpressServer)(routingControllerOptions);
const httpServer = (0, http_1.createServer)(app);
httpServer.listen(port, () => {
    console.log(`${__dirname}/modules/http/*.controller.*`);
    console.log(`This is working in port ${port}`);
});
//# sourceMappingURL=server.js.map