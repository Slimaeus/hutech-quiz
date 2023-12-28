import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.answer.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.quizCollection.deleteMany();
  await prisma.quizToQuizCollection.deleteMany();
  
  const answers = [
    {
      content: "19",
      isCorrect: false,
    },
    {
      content: "20",
      isCorrect: false,
    },
    {
      content: "21",
      isCorrect: true,
    },
    {
      content: "22",
      isCorrect: false,
    },
  ];
  const quiz = await prisma.quiz.create({
    data: {
      content: "How old are you?",
      explaination: "Your age",
      score: 1,
      answers: {
        createMany: {
          data: answers
        }
      }
    },
  });

  const quizCollection = await prisma.quizCollection.create({
    data: {
      name: "Collection 1",
      quizzes: {
        create: {
          quizId: quiz.id,
        }
      }
    },
  });

  const answer = await prisma.answer.create({
    data: 
    {
      content: "No",
      isCorrect: true,
      quiz: {
        create: {
          content: "Are you robot?",
          explaination: "Verify!",
          score: 1
        }
      }
    }
  });
}

main().catch((e) => {
  console.log(e);
});
