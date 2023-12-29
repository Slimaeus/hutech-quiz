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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesService = void 0;
const client_1 = require("@prisma/client");
const typedi_1 = require("typedi");
let QuizzesService = class QuizzesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMany(filter, include) {
        return this.prisma.quiz.findMany({
            where: filter,
            include: include
        });
    }
    get(id) {
        return this.prisma.quiz.findFirst({
            where: {
                id: id,
            },
        });
    }
    create(data) {
        return this.prisma.quiz.create({
            data: data,
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.quiz.update({
                where: {
                    id: id,
                },
                data: data,
            });
        });
    }
    delete(id) {
        return this.prisma.quiz.delete({
            where: {
                id: id,
            },
        });
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map