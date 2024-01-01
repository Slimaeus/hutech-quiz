import { Prisma, PrismaClient, Record } from "@prisma/client";
import { RecordFormValues } from "../../models/record";
import { Service } from "typedi";
import { DefaultArgs } from "@prisma/client/runtime/library";

@Service()
export class RecordsService {
  constructor(private readonly prisma: PrismaClient) {}

  getMany(filter?: Prisma.RecordWhereInput, include?: Prisma.RecordInclude<DefaultArgs>) : Promise<Record[]> {
    return this.prisma.record.findMany({
      where: filter,
      include: include
    });
  }

  get(id: string) : Promise<Record> {
    return this.prisma.record.findFirst({
      where: {
        id: id,
      },
    });
  }

  create(data: RecordFormValues) : Promise<Record> {
    return this.prisma.record.create({
      data: data,
      include: {
        answer: true,
        quiz: true,
        room: true
      }
    });
  }

  async update(id: string, data: RecordFormValues) : Promise<void> {
    await this.prisma.record.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  delete(id: string) : Promise<Record> {
    return this.prisma.record.delete({
      where: {
        id: id,
      },
    });
  }
}