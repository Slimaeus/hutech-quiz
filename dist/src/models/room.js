"use strict";
// export interface Room {
//   code: string
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomFormValues = void 0;
// export class Room {
//   code: string
//   /**
//    * @param {string} code The quiz's code
//    */
//   constructor(code: string) {
//     this.code = code;
//   }
// }
class RoomFormValues {
    static toFormValues(room) {
        const roomFormValues = new RoomFormValues();
        roomFormValues.code = room.code;
        roomFormValues.userIds = room.userIds;
        roomFormValues.isStarted = room.isStarted;
        roomFormValues.startedAt = room.startedAt;
        roomFormValues.ownerId = room.ownerId;
        roomFormValues.quizCollectionId = room.quizCollectionId;
        return roomFormValues;
    }
}
exports.RoomFormValues = RoomFormValues;
//# sourceMappingURL=room.js.map