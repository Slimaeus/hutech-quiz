// export interface Room {
//   code: string
// }

import { Room } from "@prisma/client";

// export class Room {
//   code: string

//   /**
//    * @param {string} code The quiz's code
//    */
//   constructor(code: string) {
//     this.code = code;
//   }
// }

export class RoomFormValues {
  code: string;
  isStarted: boolean;
  startedAt?: Date;
  userIds?: string[];
  quizCollectionId?: string;

  static toFormValues(room: Room): RoomFormValues {
    const roomFormValues = new RoomFormValues();
    roomFormValues.code = room.code;
    roomFormValues.userIds = room.userIds;
    roomFormValues.isStarted = room.isStarted;
    roomFormValues.startedAt = room.startedAt;
    roomFormValues.quizCollectionId = room.quizCollectionId;
    return roomFormValues;
  }
}
