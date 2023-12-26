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
const quiz_1 = require("../../models/quiz");
const client_1 = require("@prisma/client");
let QuizzesController = class QuizzesController {
    constructor() {
        this.quizzes = [new quiz_1.Quiz("Hello", "Hi", []), new quiz_1.Quiz("Good", "Bad", [])];
    }
    getQuizzes() {
        const prisma = new client_1.PrismaClient();
        const quiz = prisma.quiz.create({
            data: {
                content: "How old are you?",
                explaination: "Your age"
            }
        });
        const answer = prisma.answer.create({
            data: {
                content: "Hi",
                isCorrect: true,
                quiz: null
            },
        });
        return this.quizzes;
    }
    insertQuiz(quiz) {
        // TODO: Insert quiz
        return quiz;
    }
};
__decorate([
    (0, routing_controllers_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getQuizzes", null);
__decorate([
    (0, routing_controllers_1.Post)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quiz_1.Quiz]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "insertQuiz", null);
QuizzesController = __decorate([
    (0, routing_controllers_1.JsonController)("/quizzes", { transformResponse: true })
], QuizzesController);
exports.default = QuizzesController;
//# sourceMappingURL=quizzes.controller.js.map