import { PrismaClient, Room } from "@prisma/client";
import { RoomFormValues } from "../../models/room";
import { Service } from "typedi";

@Service()
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

  async start(id: string) {
    await this.prisma.room.update({
      where: {
        id: id
      },
      data: {
        isStarted: true,
        startedAt: new Date()
      },
    });
  }

  async startByCode(code: string) {
    await this.prisma.room.update({
      where: {
        code: code
      },
      data: {
        isStarted: true,
        startedAt: new Date()
      },
    });
  }

  async end(id: string) {
    await this.prisma.room.update({
      where: {
        id: id
      },
      data: {
        isStarted: false,
      },
    });
  }

  async endByCode(code: string) {
    await this.prisma.room.update({
      where: {
        code: code
      },
      data: {
        isStarted: false,
      },
    });
  }
}