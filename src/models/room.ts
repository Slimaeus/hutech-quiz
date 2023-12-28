import { Answer } from "./answer";

export interface Room {
  code: string
}

export class Room {
  code: string

  /**
   * @param {string} code The quiz's code
   */
  constructor(code: string) {
    this.code = code;
  }
}

export class RoomFormValues {
  code: string;
}