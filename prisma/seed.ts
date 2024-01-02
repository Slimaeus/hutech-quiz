import { Answer, Prisma, PrismaClient, Quiz } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.record.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.quizToQuizCollection.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.quizCollection.deleteMany();

  const firstCollectionQuizzes: Prisma.QuizCreateManyInput[] = [
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

  const firstCollectionAnswers: Prisma.AnswerCreateManyInput[][] = [
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

  const quizResult = await Promise.all(
    firstCollectionQuizzes.map((q, i) => {
      return prisma.quiz.create({
        data: {
          ...q,
          answers: {
            createMany: {
              data: firstCollectionAnswers[i],
            },
          },
        },
      });
    })
  );

  const firstQuizCollection = await prisma.quizCollection.create({
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
  
  const secondCollectionQuizzes: Prisma.QuizCreateManyInput[] = [
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

  const secondCollectionAnswers: Prisma.AnswerCreateManyInput[][] = [
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

  const secondQuizResult = await Promise.all(
    secondCollectionQuizzes.map((q, i) => {
      return prisma.quiz.create({
        data: {
          ...q,
          answers: {
            createMany: {
              data: secondCollectionAnswers[i],
            },
          },
        },
      });
    })
  );

  const secondQuizCollection = await prisma.quizCollection.create({
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
}

main().catch((e) => {
  console.log(e);
});
