"use strict";
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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.answer.deleteMany();
        yield prisma.quiz.deleteMany();
        const quiz = yield prisma.quiz.create({
            data: {
                content: "How old are you?",
                explaination: "Your age",
            },
        });
        const answers = [
            {
                content: "19",
                isCorrect: false,
                quizId: quiz.id
            },
            {
                content: "20",
                isCorrect: false,
                quizId: quiz.id
            },
            {
                content: "21",
                isCorrect: true,
                quizId: quiz.id
            },
            {
                content: "22",
                isCorrect: false,
                quizId: quiz.id
            },
        ];
        const createResult = yield prisma.answer.createMany({
            data: answers,
        });
        const answer = yield prisma.answer.create({
            data: {
                content: "No",
                isCorrect: true,
                quiz: {
                    create: {
                        content: "Are you robot?",
                        explaination: "Verify!"
                    }
                }
            }
        });
    });
}
main().catch((e) => {
    console.log(e);
});
//# sourceMappingURL=seed.js.map