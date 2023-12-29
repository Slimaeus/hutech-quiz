import { Socket } from "socket.io";
import { NextFunction } from "express";
import SocketHandler from "./socketHandler";
import { Account } from "../../models/account";
import { RoomsEvents } from "../../libs/events/rooms.events";
import { SocketsEvents } from "../../libs/events/sockets.events";
import { RoomsService } from "../../libs/services/rooms.service";
import { RoomFormValues } from "../../models/room";

class QuizzesSocket implements SocketHandler {
  async handleConnection(socket: Socket) {
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

  middlewareImplementation(socket: Socket, next: NextFunction) {
    socket
      .on(RoomsEvents.JOIN_ROOM, async ({ roomCode }: { roomCode: string }) => {
        const roomsService: RoomsService = new RoomsService();
        const user = socket["user"] as Account;

        var room = await roomsService.getByCode(roomCode);

        if (!room) return;

        var roomFormValues = RoomFormValues.toFormValues(room);
        if (!roomFormValues.userIds.includes(user.id))
          roomFormValues.userIds.push(user.id);
        await roomsService.update(room.id, roomFormValues);

        socket.join(roomCode);
        socket.to(roomCode).emit(RoomsEvents.JOINED_ROOM, user);
        console.info(`User: ${user.userName} joined room ${roomCode}`);
      })
      .on(RoomsEvents.LEAVE_ROOM, async ({ roomCode }: { roomCode: string }) => {
        const roomsService: RoomsService = new RoomsService();
        const user = socket["user"] as Account;

        var room = await roomsService.getByCode(roomCode);

        if (!room) return;

        var roomFormValues = RoomFormValues.toFormValues(room);
        roomFormValues.userIds = roomFormValues.userIds.filter(
          (x) => x !== user.id
        );
        await roomsService.update(room.id, roomFormValues);

        socket.leave(roomCode);
        socket.to(roomCode).emit(RoomsEvents.LEFT_ROOM, user);
        console.info(`User: ${user.userName} left room ${roomCode}`);
      });
    return next();
  }
}

export default QuizzesSocket;
