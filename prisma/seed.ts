import { Answer, Prisma, PrismaClient, Quiz } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.answer.deleteMany();
  await prisma.quizToQuizCollection.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.quizCollection.deleteMany();

  const quizzes: Prisma.QuizCreateManyInput[] = [
    {
      content: "1 + 1 = ",
      explaination: "Một cộng một bằng mấy?",
      score: 1,
    },
  ];

  const answers: Prisma.AnswerCreateManyInput[][] = [
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

  const quizResult = await Promise.all(
    quizzes.map((q, i) => {
      return prisma.quiz.create({
        data: {
          ...q,
          answers: {
            createMany: {
              data: answers[i],
            },
          },
        },
      });
    })
  );

  const quizCollection = await prisma.quizCollection.create({
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
}

main().catch((e) => {
  console.log(e);
});
