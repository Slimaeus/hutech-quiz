import { Prisma, PrismaClient, Room } from "@prisma/client";
import { RoomFormValues } from "../../models/room";
import { Service } from "typedi";
import { DefaultArgs } from "@prisma/client/runtime/library";
import axios from "axios";
import { User } from "../../models/user";
import { UnauthorizedError } from "routing-controllers";

@Service()
export class RoomsService {
  constructor(private readonly prisma: PrismaClient) {}

  async getMany(
    filter?: Prisma.RoomWhereInput,
    include?: Prisma.RoomInclude<DefaultArgs>,
    token?: string
  ): Promise<Room[]> {
    // ! Also get the owner for each room
    const rooms = await this.prisma.room.findMany({
      where: { ...filter },
      include: {
        quizCollection: true,
        currentQuiz: true,
        ...include,
      },
    });

    const ownerIds = rooms.map((x) => x.ownerId);

    if (ownerIds.length > 0 && token) {
      const usersResponse = await axios.get<User[]>(
        `${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users?${ownerIds.map(
          (id) => `userIds=${id}&`
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (usersResponse.status < 400 && usersResponse.data) {
        const ownerRegistry = usersResponse.data.reduce(
          (dict, user, index) => ((dict[user.id] = user), dict),
          {}
        );
        rooms.forEach((room) => {
          const owner = ownerRegistry[room.ownerId];
          if (owner) room["owner"] = owner;
        });
      } else {
        console.error("Get data failed", usersResponse.status);
        // throw new UnauthorizedError();
      }
    }

    return rooms;
  }

  async get(id: string, token?: string): Promise<Room> {
    const room = await this.prisma.room.findFirst({
      where: {
        id: id,
      },
      include: {
        currentQuiz: true,
        quizCollection: true,
      },
    });

    if (room.ownerId && token) {
      const ownerResponse = await axios.get<User>(
        `${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users/${room.ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (ownerResponse.status < 400) {
        room["owner"] = ownerResponse.data;
      } else {
        console.error("Get data failed", ownerResponse.status);
        // throw new UnauthorizedError();
      }

      const usersResponse = await axios.get<User[]>(
        `${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users?${room.userIds.map(
          (id) => `userIds=${id}&`
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (usersResponse.status < 400) {
        room["users"] = usersResponse.data;
      } else {
        console.error("Get data failed", usersResponse.status);
        // throw new UnauthorizedError();
      }
    }

    return room;
  }

  async getByCode(
    code: string,
    token?: string
  ): Promise<
    Prisma.RoomGetPayload<{
      include: {
        currentQuiz: {
          include: {
            answers: true;
          };
        };
        quizCollection: true;
      };
    }>
  > {
    const room = await this.prisma.room.findFirst({
      where: {
        code: code,
      },
      include: {
        currentQuiz: {
          include: {
            answers: true,
          },
        },
        quizCollection: true,
      },
    });

    if (room.ownerId && token) {
      const ownerResponse = await axios.get<User>(
        `${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users/${room.ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (ownerResponse.status < 400) {
        room["owner"] = ownerResponse.data;
      } else {
        console.error("Get data failed", ownerResponse.status);
        // throw new UnauthorizedError();
      }

      const usersResponse = await axios.get<User>(
        `${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users?${room.userIds.map(
          (id) => `userIds=${id}&`
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (usersResponse.status < 400) {
        room["users"] = usersResponse.data;
      } else {
        console.error("Get data failed", usersResponse.status);
        // throw new UnauthorizedError();
      }
    }
    return room;
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
        currentQuizId: null,
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
        currentQuizId: null,
      },
    });
  }
}
