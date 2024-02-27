import { Prisma, PrismaClient, Quiz } from "@prisma/client";
import { QuizFormValues } from "../../models/quiz";
import { Service } from "typedi";
import { DefaultArgs } from "@prisma/client/runtime/library";

@Service()
export class QuizzesService {
  constructor(private readonly prisma: PrismaClient) {}

  getMany(filter?: Prisma.QuizWhereInput, include?: Prisma.QuizInclude<DefaultArgs>) : Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: filter,
      include: include
    });
  }

  get(id: string) : Promise<Quiz> {
    return this.prisma.quiz.findFirst({
      where: {
        id: id,
      },
    });
  }

  create(data: QuizFormValues) : Promise<Quiz> {
    const { answers, ...rest} = data;
    return this.prisma.quiz.create({
      data: {
        ...rest,
        answers: {
          createMany: {
            data: answers 
          }
        }
      } 
    });
  }

  async update(id: string, data: QuizFormValues) : Promise<void> {
    const { answers, ...rest} = data;
    await this.prisma.quiz.update({
      where: {
        id: id,
      },
      data: rest,
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