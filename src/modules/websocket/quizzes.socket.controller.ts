import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
} from "socket-controllers";
import { Service } from "typedi";
import { RoomsService } from "../../libs/services/rooms.service";
import { RoomFormValues } from "../../models/room";
import { RoomsEvents } from "../../libs/events/rooms.events";
import { Account } from "../../models/account";
import { SocketsEvents } from "../../libs/events/sockets.events";
import { Socket } from "socket.io";
import { QuizzesEvents } from "../../libs/events/quizzes.events";
import { QuizCollectionsService } from "../../libs/services/quizCollections.service";
import { QuizzesService } from "../../libs/services/quizzes.service";

@SocketController(QuizzesSocketController.namespace)
@Service()
export class QuizzesSocketController {
  static namespace: string = "/hubs/quizzes";

  constructor(
    private readonly roomsService: RoomsService,
    private readonly quizCollectionsService: QuizCollectionsService,
    private readonly quizzesService: QuizzesService
  ) {}

  @OnConnect()
  async connection(@ConnectedSocket() socket: Socket) {
    const user = socket["user"] as Account;

    console.info("Quizzes namespace is working...");
    socket.emit(SocketsEvents.STARTED, "Quizzes namespace is working...");
    socket.emit("load_user", user);

    const roomCodeParam = socket.handshake.query["roomCode"];
    let roomCode = "";
    if (!roomCodeParam) return;
    if (
      Array.isArray(roomCodeParam) &&
      roomCodeParam.every((item) => typeof item === "string")
    ) {
      roomCode = roomCodeParam.join("");
    }
    roomCode = roomCodeParam as string;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    const roomFormValues = RoomFormValues.toFormValues(room);
    if (!roomFormValues.userIds.includes(user.id))
      roomFormValues.userIds.push(user.id);
    await this.roomsService.update(room.id, roomFormValues);

    socket.join(roomCode);

    const quizzes = await this.quizzesService.getMany({ collections: {
      every: {
        quizCollectionId: room.quizCollectionId
      }
    }});

    socket.to(roomCode).emit(QuizzesEvents.LOADED_QUIZZES, quizzes);

    socket.to(roomCode).emit(RoomsEvents.JOINED_ROOM, user);
    console.info(`User: ${user.userName} joined room ${roomCode}`);
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: Socket) {
    console.info("client disconnected");
  }

  @OnMessage(RoomsEvents.JOIN_ROOM)
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as Account;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    const roomFormValues = RoomFormValues.toFormValues(room);
    if (!roomFormValues.userIds.includes(user.id))
      roomFormValues.userIds.push(user.id);
    await this.roomsService.update(room.id, roomFormValues);

    socket.join(roomCode);
    socket.to(roomCode).emit(RoomsEvents.JOINED_ROOM, user);
    console.info(`User: ${user.userName} joined room ${roomCode}`);
  }

  @OnMessage(RoomsEvents.LEAVE_ROOM)
  async leaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as Account;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    const roomFormValues = RoomFormValues.toFormValues(room);
    roomFormValues.userIds = roomFormValues.userIds.filter(
      (x) => x !== user.id
    );
    await this.roomsService.update(room.id, roomFormValues);

    socket.leave(roomCode);
    socket.to(roomCode).emit(RoomsEvents.LEFT_ROOM, user);
    console.info(`User: ${user.userName} left room ${roomCode}`);
  }

  @OnMessage(RoomsEvents.START_ROOM)
  async startRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as Account;

    var room = await this.roomsService.getByCode(roomCode);

    if (!room || !room.ownerId || room.ownerId !== user.id) return;

    await this.roomsService.start(room.id);

    socket.to(roomCode).emit(RoomsEvents.STARTED_ROOM, room.id);
    console.info(`User: ${user.userName} start room ${roomCode}`);
  }

  @OnMessage(RoomsEvents.END_ROOM)
  async endRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as Account;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room || !room.ownerId || room.ownerId !== user.id) return;

    await this.roomsService.end(room.id);

    socket.to(roomCode).emit(RoomsEvents.ENDED_ROOM, room.id);
    console.info(`User: ${user.userName} start room ${roomCode}`);
  }
}
