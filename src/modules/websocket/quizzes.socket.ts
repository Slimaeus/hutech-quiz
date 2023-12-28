import { Socket } from "socket.io";
import { NextFunction } from "express";
import { Room } from "@prisma/client";
import SocketHandler from "./socketHandler";
import { Account } from "../../models/account";
import { RoomsEvents } from "../../libs/events/rooms.events";
import { SocketsEvents } from "../../libs/events/sockets.events";
import { RoomsService } from "../../libs/services/rooms.service";
import { RoomFormValues } from "../../models/room";

class QuizzesSocket implements SocketHandler {
  
  
  handleConnection(socket: Socket) {
    console.info("Quizzes namespace is working...")
    socket.emit(SocketsEvents.STARTED, "Quizzes namespace is working...");
    const user = socket["user"] as Account;
    socket.emit("load_user", user);
  }

  middlewareImplementation(socket: Socket, next: NextFunction) {
    socket
      .on(RoomsEvents.JOIN_ROOM, async ({ roomId }: { roomId: string }) => {
        const roomsService: RoomsService = new RoomsService();
        const user = socket["user"] as Account;

        var room : Room = await roomsService.get(roomId);

        if (!room) return;

        var roomFormValues = RoomFormValues.toFormValues(room);
        if (!roomFormValues.userIds.includes(user.id))
          roomFormValues.userIds.push(user.id);
        await roomsService.update(roomId, roomFormValues);

        socket.join(roomId);
        socket.to(roomId).emit(RoomsEvents.JOINED_ROOM, user);
        console.info(`User: ${user.userName} joined room ${roomId}`);
      })
      .on(RoomsEvents.LEAVE_ROOM, async ({ roomId }: { roomId: string }) => {
        const roomsService: RoomsService = new RoomsService();
        const user = socket["user"] as Account;

        var room : Room = await roomsService.get(roomId);
        
        if (!room) return;

        var roomFormValues = RoomFormValues.toFormValues(room);
        roomFormValues.userIds = roomFormValues.userIds.filter(x => x !== user.id);
        await roomsService.update(roomId, roomFormValues);

        socket.leave(roomId);
        socket.to(roomId).emit(RoomsEvents.LEFT_ROOM, user);
        console.info(`User: ${user.userName} left room ${roomId}`);
      });
    return next();
  }
}

export default QuizzesSocket;
