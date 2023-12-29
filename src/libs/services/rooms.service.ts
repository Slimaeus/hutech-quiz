import { PrismaClient, Room } from "@prisma/client";
import { RoomFormValues } from "../../models/room";

export class RoomsService {
  prisma: PrismaClient = new PrismaClient();

  getMany() : Promise<Room[]>{
    return this.prisma.room.findMany();
  }

  get(id: string) : Promise<Room> {
    return this.prisma.room.findFirst({
      where: {
        id: id,
      },
    });
  }

  getByCode(code: string) : Promise<Room> {
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
        id: id
      },
      data: data,
    });
  }

  delete(id: string) : Promise<Room> {
    return this.prisma.room.delete({
      where: {
        id: id,
      },
    });
  }
}