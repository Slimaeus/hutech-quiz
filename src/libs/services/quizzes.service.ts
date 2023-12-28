import { PrismaClient } from "@prisma/client";
import { QuizFormValues } from "../../models/quiz";

export class QuizzesService {
  prisma: PrismaClient = new PrismaClient();

  getMany() {
    return this.prisma.quiz.findMany();
  }

  get(id: string) {
    return this.prisma.quiz.findFirst({
      where: {
        id: id,
      },
    });
  }

  create(data: QuizFormValues) {
    return this.prisma.quiz.create({
      data: data,
    });
  }

  async update(id: string, data: QuizFormValues) {
    await this.prisma.quiz.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  delete(id: string) {
    return this.prisma.quiz.delete({
      where: {
        id: id,
      },
    });
  }
}