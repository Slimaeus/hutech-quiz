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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const quiz_1 = require("../../models/quiz");
const client_1 = require("@prisma/client");
const quizzes_service_1 = require("../../libs/services/quizzes.service");
const typedi_1 = require("typedi");
let QuizzesController = class QuizzesController {
    constructor(quizzesService) {
        this.quizzesService = quizzesService;
        this.prisma = new client_1.PrismaClient();
    }
    getQuizzes() {
        return this.quizzesService.getMany();
    }
    getQuiz(quizId) {
        return this.quizzesService.get(quizId);
    }
    insertQuiz(quizFormValues) {
        return this.quizzesService.create(quizFormValues);
    }
    updateQuiz(quizId, quizFormValues) {
        return this.quizzesService.update(quizId, quizFormValues);
    }
    deleteQuiz(quizId) {
        return this.quizzesService.delete(quizId);
    }
};
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Authorized)(),
    (0, routing_controllers_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getQuizzes", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Get)("/:quizId"),
    __param(0, (0, routing_controllers_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getQuiz", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(201),
    (0, routing_controllers_1.Post)(),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quiz_1.QuizFormValues]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "insertQuiz", null);
__decorate([
    (0, routing_controllers_1.OnUndefined)(204),
    (0, routing_controllers_1.Put)("/:quizId"),
    __param(0, (0, routing_controllers_1.Param)("quizId")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quiz_1.QuizFormValues]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "updateQuiz", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Delete)("/:quizId"),
    __param(0, (0, routing_controllers_1.Param)("quizId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "deleteQuiz", null);
QuizzesController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/api/v1/quizzes", { transformResponse: true }),
    __metadata("design:paramtypes", [quizzes_service_1.QuizzesService])
], QuizzesController);
exports.default = QuizzesController;
