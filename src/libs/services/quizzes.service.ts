import { PrismaClient, Quiz } from "@prisma/client";
import { QuizFormValues } from "../../models/quiz";
import { Service } from "typedi";

@Service()
export class QuizzesService {
  prisma: PrismaClient = new PrismaClient();

  getMany() : Promise<Quiz[]> {
    return this.prisma.quiz.findMany();
  }

  get(id: string) : Promise<Quiz> {
    return this.prisma.quiz.findFirst({
      where: {
        id: id,
      },
    });
  }

  create(data: QuizFormValues) : Promise<Quiz> {
    return this.prisma.quiz.create({
      data: data,
    });
  }

  async update(id: string, data: QuizFormValues) : Promise<void> {
    await this.prisma.quiz.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  delete(id: string) : Promise<Quiz> {
    return this.prisma.quiz.delete({
      where: {
        id: id,
      },
    });
  }
}