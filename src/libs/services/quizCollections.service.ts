import { PrismaClient, QuizCollection } from "@prisma/client";
import { QuizCollectionFormValues } from "../../models/quizCollection";
import { Service } from "typedi";

@Service()
export class QuizCollectionsService {
  prisma: PrismaClient = new PrismaClient();

  getMany() : Promise<QuizCollection[]> {
    return this.prisma.quizCollection.findMany();
  }

  get(id: string) : Promise<QuizCollection> {
    return this.prisma.quizCollection.findFirst({
      where: {
        id: id,
      },
    });
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