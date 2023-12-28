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
        yield prisma.quizToQuizCollection.deleteMany();
        yield prisma.quiz.deleteMany();
        yield prisma.quizCollection.deleteMany();
        const quizzes = [
            {
                content: "1 + 1 = ",
                explaination: "Một cộng một bằng mấy?",
                score: 1,
            },
        ];
        const answers = [
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
        ];
        const quizResult = yield Promise.all(quizzes.map((q, i) => {
            return prisma.quiz.create({
                data: Object.assign(Object.assign({}, q), { answers: {
                        createMany: {
                            data: answers[i],
                        },
                    } }),
            });
        }));
        const quizCollection = yield prisma.quizCollection.create({
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
        // const answer = await prisma.answer.create({
        //   data: {
        //     content: "No",
        //     isCorrect: true,
        //     quiz: {
        //       create: {
        //         content: "Are you robot?",
        //         explaination: "Verify!",
        //         score: 1,
        //       },
        //     },
        //   },
        // });
    });
}
main().catch((e) => {
    console.log(e);
});
//# sourceMappingURL=seed.js.map