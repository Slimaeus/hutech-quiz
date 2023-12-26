import { PrismaClient } from "@prisma/client";

export class QuizzesService {
  prisma: PrismaClient = new PrismaClient();

  getMany() {
    return this.prisma.quiz.findMany();
  }

  get(id: any) {
    return this.prisma.quiz.findFirst({
      where: {
        id: id,
      },
    });
  }

  create(data: any) {
    return this.prisma.quiz.create({
      data: data,
    });
  }

  async update(id: any, data) {
    await this.prisma.quiz.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  delete(id: any) {
    return this.prisma.quiz.delete({
      where: {
        id: id,
      },
    });
  }
}