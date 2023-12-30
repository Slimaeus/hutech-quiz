import { Prisma, PrismaClient, Room } from "@prisma/client";
import { RoomFormValues } from "../../models/room";
import { Service } from "typedi";
import { DefaultArgs } from "@prisma/client/runtime/library";

@Service()
export class RoomsService {
  constructor(private readonly prisma: PrismaClient) {}

  getMany(
    filter?: Prisma.RoomWhereInput,
    include?: Prisma.RoomInclude<DefaultArgs>
  ): Promise<Room[]> {
    return this.prisma.room.findMany({
      where: filter,
      include: include,
    });
  }

  get(id: string): Promise<Room> {
    return this.prisma.room.findFirst({
      where: {
        id: id,
      },
      include: {
        quizCollection: true,
      },
    });
  }

  getByCode(code: string): Promise<Room> {
    return this.prisma.room.findFirst({
      where: {
        code: code,
      },
    });
  }

  create(data: RoomFormValues) {
    return this.prisma.room.create({
      data: data,
    });
  }

  async update(id: string, data: RoomFormValues) {
    await this.prisma.room.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  delete(id: string): Promise<Room> {
    return this.prisma.room.delete({
      where: {
        id: id,
      },
    });
  }

  async start(id: string) {
    const room = await this.get(id);
    if (!room) return;

    const dataToUpdate: Prisma.RoomUncheckedUpdateInput = {
      isStarted: true,
      startedAt: new Date(),
    };

    if (room.quizCollectionId) {
      const firstQuiz = await this.prisma.quizToQuizCollection.findFirst({
        where: {
          quizCollectionId: room.quizCollectionId,
        },
        orderBy: {
          id: "asc",
        },
      });

      if (firstQuiz) {
        dataToUpdate.currentQuizId = firstQuiz.quizId;
      }
    }

    // Start the room and set the current quiz
    await this.prisma.room.update({
      where: {
        id: id,
      },
      data: dataToUpdate,
    });
  }

  async startByCode(code: string) {
    const room = await this.getByCode(code);
    if (!room) return;
    const dataToUpdate: Prisma.RoomUncheckedUpdateInput = {
      isStarted: true,
      startedAt: new Date(),
    };
    if (room.quizCollectionId) {
      const firstQuiz = await this.prisma.quizToQuizCollection.findFirst({
        where: {
          quizCollectionId: room.quizCollectionId,
        },
        orderBy: {
          id: "asc",
        },
      });

      if (firstQuiz) {
        dataToUpdate.currentQuizId = firstQuiz.quizId;
      }
    }

    // Start the room and set the current quiz
    await this.prisma.room.update({
      where: {
        code: code,
      },
      data: dataToUpdate,
    });
  }

  async end(id: string) {
    await this.prisma.room.update({
      where: {
        id: id,
      },
      data: {
        isStarted: false,
        startedAt: null,
        currentQuizId: null
      },
    });
  }

  async endByCode(code: string) {
    await this.prisma.room.update({
      where: {
        code: code,
      },
      data: {
        isStarted: false,
        startedAt: null,
        currentQuizId: null
      },
    });
  }
}
