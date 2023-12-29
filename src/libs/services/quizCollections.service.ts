import { Prisma, PrismaClient, Quiz, QuizCollection } from "@prisma/client";
import { QuizCollectionFormValues } from "../../models/quizCollection";
import { Service } from "typedi";
import { DefaultArgs } from "@prisma/client/runtime/library";

@Service()
export class QuizCollectionsService {
  prisma: PrismaClient = new PrismaClient();

  getMany(filter?: Prisma.QuizCollectionWhereInput, include?: Prisma.QuizCollectionInclude<DefaultArgs>) : Promise<QuizCollection[]> {
    return this.prisma.quizCollection.findMany({
      where: filter,
      include: include
    });
  }

  get(id: string) : Promise<QuizCollection> {
    return this.prisma.quizCollection.findFirst({
      where: {
        id: id,
      },
    });
  }

  async getQuizzes(id: string) : Promise<QuizCollection> {
    const quizCollection = await this.prisma.quizCollection.findFirst({
      where: {
        id: id,
      },
      include: {
        quizzes: true
      }
    });

    return quizCollection;
  }

  create(data: QuizCollectionFormValues) : Promise<QuizCollection> {
    return this.prisma.quizCollection.create({
      data: data,
    });
  }

  async update(id: string, data: QuizCollectionFormValues) : Promise<void> {
    await this.prisma.quizCollection.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  delete(id: string) : Promise<QuizCollection> {
    return this.prisma.quizCollection.delete({
      where: {
        id: id,
      },
    });
  }
}