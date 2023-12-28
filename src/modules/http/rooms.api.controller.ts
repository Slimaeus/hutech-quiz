import {
  JsonController,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  Authorized,
} from "routing-controllers";
import { RoomFormValues } from "../../models/room";
import { PrismaClient } from "@prisma/client";
import { RoomsService } from "../../libs/services/rooms.service";

@JsonController("/api/v1/rooms", { transformResponse: true })
class RoomsController {
  roomsService: RoomsService = new RoomsService();

  prisma: PrismaClient = new PrismaClient();

  @HttpCode(200)
  @Authorized()
  @Get()
  getRooms() {
    return this.roomsService.getMany();
  }

  @HttpCode(200)
  @Get("/:id")
  getRoom(@Param("id") id: string) {
    return this.roomsService.get(id);
  }

  @HttpCode(201)
  @Post()
  insertRoom(@Body() roomFormValues: RoomFormValues) {
    return this.roomsService.create(roomFormValues);
  }

  @HttpCode(204)
  @Put("/:id")
  async updateRoom(
    @Param("id") id: string,
    @Body() roomFormValues: RoomFormValues
  ) {
    await this.roomsService.update(id, roomFormValues);
  }

  @HttpCode(204)
  @Delete("/:id")
  deleteRoom(@Param("id") id: string) {
    return this.roomsService.delete(id);
  }
}

export default RoomsController;
