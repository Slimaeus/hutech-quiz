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
  OnUndefined,
  Patch,
  CurrentUser,
  HeaderParam,
} from "routing-controllers";
import { RoomFormValues } from "../../models/room";
import { PrismaClient } from "@prisma/client";
import { RoomsService } from "../../libs/services/rooms.service";
import { Account } from "../../models/account";
import { Service } from "typedi";
import Websocket from "../websocket/webSocket";
import { QuizzesSocketController } from "../websocket/quizzes.socket.controller";
import { RoomsEvents } from "../../libs/events/rooms.events";
import randomstring from "randomstring";

@Service()
@JsonController("/api/v1/rooms", { transformResponse: true })
class RoomsController {
  prisma: PrismaClient = new PrismaClient();

  constructor(
    private readonly roomsService: RoomsService,
    private readonly websocket: Websocket
  ) {}

  @HttpCode(200)
  @Authorized()
  @Get()
  getRooms(
    @HeaderParam("authorization") token: string) {
    if (token) return this.roomsService.getMany({}, {}, token.split(" ")[1]);
    return this.roomsService.getMany();
  }

  @HttpCode(200)
  @Get("/:roomId")
  getRoom(
    @Param("roomId") roomId: string,
    @HeaderParam("authorization") token: string
  ) {
    if (token) return this.roomsService.get(roomId, token.split(" ")[1]);
    return this.roomsService.get(roomId);
  }

  @HttpCode(200)
  @Get("/code/:code")
  getRoomByCode(@Param("code") code: string,
  @HeaderParam("authorization") token: string) {
    if (token) return this.roomsService.getByCode(code, token.split(" ")[1]);
    return this.roomsService.getByCode(code);
  }

  @Authorized()
  @HttpCode(201)
  @Post()
  insertRoom(
    @Body() roomFormValues: RoomFormValues,
    @CurrentUser() user: Account
  ) {
    const code = randomstring.generate({
      length: 6,
    });
    roomFormValues.code = code;
    roomFormValues.ownerId = user.id;
    return this.roomsService.create(roomFormValues);
  }

  @OnUndefined(204)
  @Patch("/:roomId/start")
  async startRoom(@Param("roomId") roomId: string) {
    const room = await this.roomsService.get(roomId);
    const roomCode = room.code;
    if (!roomCode) return;
    await this.roomsService.start(roomId);
    this.websocket
      .of(QuizzesSocketController.namespace)
      .emit(RoomsEvents.STARTED_ROOM, roomCode);
  }

  @OnUndefined(204)
  @Patch("/:roomId/stop")
  async stopRoom(@Param("roomId") roomId: string) {
    const room = await this.roomsService.get(roomId);
    const roomCode = room.code;
    if (!roomCode) return;
    await this.roomsService.end(roomId);
    this.websocket
      .of(QuizzesSocketController.namespace)
      .emit(RoomsEvents.ENDED_ROOM, roomCode);
  }

  @OnUndefined(204)
  @Patch("/code/:code/start")
  async startRoomByCode(@Param("code") code: string) {
    await this.roomsService.startByCode(code);
    this.websocket
      .of(QuizzesSocketController.namespace)
      .to(code)
      .emit(RoomsEvents.STARTED_ROOM, code);
  }

  @OnUndefined(204)
  @Patch("code/:code/stop")
  async stopRoomByCode(@Param("code") code: string) {
    await this.roomsService.endByCode(code);
    this.websocket
      .of(QuizzesSocketController.namespace)
      .to(code)
      .emit(RoomsEvents.ENDED_ROOM, code);
  }

  @OnUndefined(204)
  @Put("/:roomId")
  updateRoom(
    @Param("roomId") roomId: string,
    @Body() roomFormValues: RoomFormValues
  ) {
    return this.roomsService.update(roomId, roomFormValues);
  }

  @HttpCode(200)
  @Delete("/:roomId")
  deleteRoom(@Param("roomId") roomId: string) {
    return this.roomsService.delete(roomId);
  }
}

export default RoomsController;
