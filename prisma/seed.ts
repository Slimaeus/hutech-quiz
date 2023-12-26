import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.answer.deleteMany();
  await prisma.quiz.deleteMany();
  const quiz = await prisma.quiz.create({
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
  const createResult = await prisma.answer.createMany({
    data: answers,
  });

  const answer = await prisma.answer.create({
    data: 
    {
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
}

main().catch((e) => {
  console.log(e);
});
