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
    // Fetch the first quiz from the quiz collection
    const firstQuiz = await this.prisma.quizToQuizCollection.findFirst({
      where: {
        quizCollection: {
          room: {
            every: {
              id: id
            }
          }
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const dataToUpdate: Prisma.RoomUncheckedUpdateInput = {
      isStarted: true,
      startedAt: new Date(),
    };

    if (firstQuiz) {
      dataToUpdate.currentQuizId = firstQuiz.quizId;
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
    await this.prisma.room.update({
      where: {
        code: code,
      },
      data: {
        isStarted: true,
        startedAt: new Date(),
      },
    });
  }

  async end(id: string) {
    await this.prisma.room.update({
      where: {
        id: id,
      },
      data: {
        isStarted: false,
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
      },
    });
  }
}
