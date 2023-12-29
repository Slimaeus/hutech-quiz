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
const quizCollection_1 = require("../../models/quizCollection");
const client_1 = require("@prisma/client");
const quizCollections_service_1 = require("../../libs/services/quizCollections.service");
const typedi_1 = require("typedi");
let QuizCollectionsController = class QuizCollectionsController {
    constructor(quizCollectionsService) {
        this.quizCollectionsService = quizCollectionsService;
        this.prisma = new client_1.PrismaClient();
    }
    getQuizCollectionCollections() {
        return this.quizCollectionsService.getMany();
    }
    getQuizCollection(quizCollectionId) {
        return this.quizCollectionsService.get(quizCollectionId, {}, { quizzes: {
                include: {
                    quiz: true
                }
            } });
    }
    insertQuizCollection(quizFormValues) {
        return this.quizCollectionsService.create(quizFormValues);
    }
    updateQuizCollection(quizCollectionId, quizFormValues) {
        return this.quizCollectionsService.update(quizCollectionId, quizFormValues);
    }
    deleteQuizCollection(quizCollectionId) {
        return this.quizCollectionsService.delete(quizCollectionId);
    }
};
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Authorized)(),
    (0, routing_controllers_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizCollectionsController.prototype, "getQuizCollectionCollections", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Get)("/:quizCollectionId"),
    __param(0, (0, routing_controllers_1.Param)("quizCollectionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizCollectionsController.prototype, "getQuizCollection", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(201),
    (0, routing_controllers_1.Post)(),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quizCollection_1.QuizCollectionFormValues]),
    __metadata("design:returntype", void 0)
], QuizCollectionsController.prototype, "insertQuizCollection", null);
__decorate([
    (0, routing_controllers_1.OnUndefined)(204),
    (0, routing_controllers_1.Put)("/:quizCollectionId"),
    __param(0, (0, routing_controllers_1.Param)("quizCollectionId")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quizCollection_1.QuizCollectionFormValues]),
    __metadata("design:returntype", void 0)
], QuizCollectionsController.prototype, "updateQuizCollection", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Delete)("/:quizCollectionId"),
    __param(0, (0, routing_controllers_1.Param)("quizCollectionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizCollectionsController.prototype, "deleteQuizCollection", null);
QuizCollectionsController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/api/v1/quizCollections", { transformResponse: true }),
    __metadata("design:paramtypes", [quizCollections_service_1.QuizCollectionsService])
], QuizCollectionsController);
exports.default = QuizCollectionsController;
//# sourceMappingURL=quizCollections.api.controller.js.map