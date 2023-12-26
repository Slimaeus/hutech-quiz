"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const client_1 = require("@prisma/client");
const quizzes_service_1 = require("../../libs/services/quizzes.service");
let QuizzesController = class QuizzesController {
    constructor() {
        this.quizzeService = new quizzes_service_1.QuizzesService();
        this.prisma = new client_1.PrismaClient();
    }
    getQuizzes() {
        return;
    }
};
__decorate([
    (0, routing_controllers_1.Get)(),
    (0, routing_controllers_1.Render)('index.html'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getQuizzes", null);
QuizzesController = __decorate([
    (0, routing_controllers_1.JsonController)("/v1/quizzes", { transformResponse: true })
], QuizzesController);
exports.default = QuizzesController;
//# sourceMappingURL=quizzes.controller.js.map