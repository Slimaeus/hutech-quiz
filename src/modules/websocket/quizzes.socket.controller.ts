import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
  SocketIO,
  SocketQueryParam,
} from "socket-controllers";
import { Service } from "typedi";
import { RoomsService } from "../../libs/services/rooms.service";
import { RoomFormValues } from "../../models/room";
import { RoomsEvents } from "../../libs/events/rooms.events";
import { SocketsEvents } from "../../libs/events/sockets.events";
import { Socket } from "socket.io";
import { QuizzesEvents } from "../../libs/events/quizzes.events";
import { QuizCollectionsService } from "../../libs/services/quizCollections.service";
import { QuizzesService } from "../../libs/services/quizzes.service";
import { User } from "../../models/user";
import { RecordsService } from "../../libs/services/records.service";
import { RecordFormValues } from "../../models/record";

@SocketController(QuizzesSocketController.namespace)
@Service()
export class QuizzesSocketController {
  static namespace: string = "/hubs/quizzes";

  constructor(
    private readonly roomsService: RoomsService,
    private readonly quizCollectionsService: QuizCollectionsService,
    private readonly quizzesService: QuizzesService,
    private readonly recordsService: RecordsService
  ) {}

  @OnConnect()
  async connection(
    @ConnectedSocket() socket: Socket,
    @SocketQueryParam("roomCode") roomCode: string
  ) {
    const user = socket["user"] as User;

    console.info("Quizzes namespace is working...");
    socket.emit(SocketsEvents.STARTED, "Quizzes namespace is working...");
    socket.emit("load_user", user);

    // const roomCode = socket.handshake.query.roomCode as string;

    console.log("Room code: ");
    console.log(roomCode);

    if (!roomCode) return socket.disconnect();

    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    const roomFormValues = RoomFormValues.toFormValues(room);
    if (!roomFormValues.userIds.includes(user.id))
      roomFormValues.userIds.push(user.id);
    await this.roomsService.update(room.id, roomFormValues);

    socket.join(roomCode);

    const quizzes = await this.quizzesService.getMany({
      collections: {
        every: {
          quizCollectionId: room.quizCollectionId,
        },
      },
    });

    socket.emit(QuizzesEvents.LOADED_QUIZZES, quizzes);

    socket.to(roomCode).emit(RoomsEvents.JOINED_ROOM, user);
    console.info(`User (${user.userName}) joined room ${roomCode}`);
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: Socket) {
    console.info(`User (${socket["user"].userName}) disconnected`);
  }

  @OnMessage(RoomsEvents.JOIN_ROOM)
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as User;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    const roomFormValues = RoomFormValues.toFormValues(room);
    if (!roomFormValues.userIds.includes(user.id))
      roomFormValues.userIds.push(user.id);
    await this.roomsService.update(room.id, roomFormValues);

    socket.join(roomCode);
    socket.to(roomCode).emit(RoomsEvents.JOINED_ROOM, user);
    console.info(`User (${user.userName}) joined room ${roomCode}`);
  }

  @OnMessage(RoomsEvents.LEAVE_ROOM)
  async leaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as User;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    const roomFormValues = RoomFormValues.toFormValues(room);
    roomFormValues.userIds = roomFormValues.userIds.filter(
      (x) => x !== user.id
    );
    await this.roomsService.update(room.id, roomFormValues);

    socket.leave(roomCode);
    socket.to(roomCode).emit(RoomsEvents.LEFT_ROOM, user);
    console.info(`User (${user.userName}) left room ${roomCode}`);
  }

  @OnMessage(RoomsEvents.START_ROOM)
  async startRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as User;

    var room = await this.roomsService.getByCode(roomCode);

    if (!room || !room.ownerId || room.ownerId !== user.id) return;

    await this.roomsService.start(room.id);

    socket.to(roomCode).emit(RoomsEvents.STARTED_ROOM, room.code);
    console.info(`User (${user.userName}) start room ${roomCode}`);
  }

  @OnMessage(RoomsEvents.END_ROOM)
  async endRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const user = socket["user"] as User;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room || !room.ownerId || room.ownerId !== user.id) return;

    await this.roomsService.end(room.id);

    socket.to(roomCode).emit(RoomsEvents.ENDED_ROOM, room.code);
    console.info(`User (${user.userName}) start room ${roomCode}`);
  }

  @OnMessage(QuizzesEvents.LOAD_CURRENT_QUIZ)
  async loadQuiz(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomCode }: { roomCode: string }
  ) {
    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    socket.emit(QuizzesEvents.LOADED_CURRENT_QUIZ, room.currentQuiz);
    socket
      .to(room.code)
      .emit(QuizzesEvents.LOADED_CURRENT_QUIZ, room.currentQuiz);
  }

  @OnMessage(QuizzesEvents.ANSWER_QUIZ)
  async answerQuiz(
    @ConnectedSocket() socket: Socket,
    @SocketQueryParam("roomCode") roomCode: string,
    @MessageBody() { quizId, answerId }: { quizId: string; answerId: string }
  ) {
    const user = socket["user"] as User;

    const room = await this.roomsService.getByCode(roomCode);

    if (!room) return;

    const recordFormValues = new RecordFormValues();
    recordFormValues.answerId = answerId;
    recordFormValues.quizId = quizId;
    recordFormValues.userId = user.id;
    recordFormValues.roomId = room.id;

    const result = await this.recordsService.create(recordFormValues);
    const formattedUser = {
      id: user.id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
    result["user"] = formattedUser;

    socket.emit(QuizzesEvents.ANSWERED_QUIZ, result);
    socket.to(room.code).emit(QuizzesEvents.ANSWERED_QUIZ, {
      user: formattedUser,
    });
  }
}
