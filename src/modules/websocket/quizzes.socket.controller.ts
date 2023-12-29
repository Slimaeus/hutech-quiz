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

@SocketController(QuizzesSocketController.namespace)
@Service()
export class QuizzesSocketController {
  static namespace: string = "/hubs/quizzes";

  private readonly roomsService: RoomsService;

  constructor(private readonly injectedRoomsService: RoomsService) {
    this.roomsService = injectedRoomsService;
  }

  @OnConnect()
  async connection(@ConnectedSocket() socket: any) {
    const roomsService: RoomsService = new RoomsService();
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

    var room = await roomsService.getByCode(roomCode);

    if (!room) return;

    var roomFormValues = RoomFormValues.toFormValues(room);
    if (!roomFormValues.userIds.includes(user.id))
      roomFormValues.userIds.push(user.id);
    await roomsService.update(room.id, roomFormValues);

    socket.join(roomCode);
    socket.to(roomCode).emit(RoomsEvents.JOINED_ROOM, user);
    console.info(`User: ${user.userName} joined room ${roomCode}`);
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    console.info("client disconnected");
  }

  @OnMessage(RoomsEvents.JOIN_ROOM)
  async joinRoom(
    @ConnectedSocket() socket: any,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as Account;

    var room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    var roomFormValues = RoomFormValues.toFormValues(room);
    if (!roomFormValues.userIds.includes(user.id))
      roomFormValues.userIds.push(user.id);
    await this.roomsService.update(room.id, roomFormValues);

    socket.join(roomCode);
    socket.to(roomCode).emit(RoomsEvents.JOINED_ROOM, user);
    console.info(`User: ${user.userName} joined room ${roomCode}`);
  }

  @OnMessage(RoomsEvents.LEAVE_ROOM)
  async leaveRoom(
    @ConnectedSocket() socket: any,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as Account;

    var room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    var roomFormValues = RoomFormValues.toFormValues(room);
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
    @ConnectedSocket() socket: any,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as Account;

    var room = await this.roomsService.getByCode(roomCode);

    if (!room || !room.ownerId || room.ownerId !== user.id) return;

    var roomFormValues = RoomFormValues.toFormValues(room);
    roomFormValues.isStarted = true;
    roomFormValues.startedAt = new Date();
    await this.roomsService.update(room.id, roomFormValues);

    socket.to(roomCode).emit(RoomsEvents.STARTED_ROOM, room);
    console.info(`User: ${user.userName} start room ${roomCode}`);
  }
}
