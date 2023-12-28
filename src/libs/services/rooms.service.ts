import { PrismaClient } from "@prisma/client";
import { RoomFormValues } from "../../models/room";

export class RoomsService {
  prisma: PrismaClient = new PrismaClient();

  getMany() {
    return this.prisma.room.findMany();
  }

  get(id: string) {
    return this.prisma.room.findFirst({
      where: {
        id: id,
      },
    });
  }

  create(data: RoomFormValues) {
    return this.prisma.room.create({
      data: data,
    });
  }

  async update(id: any, data: RoomFormValues) {
    await this.prisma.room.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  delete(id: any) {
    return this.prisma.room.delete({
      where: {
        id: id,
      },
    });
  }
}