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
        yield prisma.record.deleteMany();
        yield prisma.answer.deleteMany();
        yield prisma.quizToQuizCollection.deleteMany();
        yield prisma.quiz.deleteMany();
        yield prisma.quizCollection.deleteMany();
        const firstCollectionQuizzes = [
            {
                content: "1 + 1 = ",
                explaination: "Một cộng một bằng hai",
                score: 1,
            },
            {
                content: "3 -  2 = ",
                explaination: "Ba trừ hai bằng một",
                score: 1,
            },
        ];
        const firstCollectionAnswers = [
            [
                {
                    content: "1",
                    isCorrect: false,
                },
                {
                    content: "2",
                    isCorrect: true,
                },
                { content: "3", isCorrect: false },
                { content: "4", isCorrect: false },
            ],
            [
                {
                    content: "1",
                    isCorrect: true,
                },
                {
                    content: "2",
                    isCorrect: false,
                },
                { content: "3", isCorrect: false },
                { content: "4", isCorrect: false },
            ]
        ];
        const quizResult = yield Promise.all(firstCollectionQuizzes.map((q, i) => {
            return prisma.quiz.create({
                data: Object.assign(Object.assign({}, q), { answers: {
                        createMany: {
                            data: firstCollectionAnswers[i],
                        },
                    } }),
            });
        }));
        const firstQuizCollection = yield prisma.quizCollection.create({
            data: {
                name: "Toán cấp 1",
                quizzes: {
                    create: quizResult.map((q) => {
                        return {
                            quizId: q.id,
                        };
                    }),
                },
            },
        });
        const secondCollectionQuizzes = [
            {
                content: "2x + 4 = 0. x = ?",
                explaination: "Phương trình bậc một",
                score: 5,
            },
            {
                content: "-3x + 12 = 0. x = ?",
                explaination: "Phương trình bậc một",
                score: 5,
            },
        ];
        const secondCollectionAnswers = [
            [
                {
                    content: "-2",
                    isCorrect: true,
                },
                {
                    content: "-1",
                    isCorrect: false,
                },
                { content: "0", isCorrect: false },
                { content: "2", isCorrect: false },
            ],
            [
                {
                    content: "1",
                    isCorrect: false,
                },
                {
                    content: "2",
                    isCorrect: false,
                },
                { content: "3", isCorrect: false },
                { content: "4", isCorrect: true },
            ]
        ];
        const secondQuizResult = yield Promise.all(secondCollectionQuizzes.map((q, i) => {
            return prisma.quiz.create({
                data: Object.assign(Object.assign({}, q), { answers: {
                        createMany: {
                            data: secondCollectionAnswers[i],
                        },
                    } }),
            });
        }));
        const secondQuizCollection = yield prisma.quizCollection.create({
            data: {
                name: "Toán cấp 2",
                quizzes: {
                    create: secondQuizResult.map((q) => {
                        return {
                            quizId: q.id,
                        };
                    }),
                },
            },
        });
    });
}
main().catch((e) => {
    console.log(e);
});
