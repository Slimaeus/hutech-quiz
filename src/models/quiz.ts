import { Answer } from "./answer";

export interface Quiz {
  content: string;
  explaination: string;
  answers: Answer[];
}

export class Quiz {
  content: string;
  explaination: string;
  answers: Answer[];

  /**
   * @param {string} content The quiz's content
   * @param {string} explaination The explaination of this quiz
   * @param {Answer[]} answers All the answers available
   */
  constructor(content: string, explaination: string, answers: Answer[]) {
    this.content = content;
    this.explaination = explaination;
    this.answers = answers;
  }
}

export class QuizFormValues {
  content: string;
  explaination: string;
  // answers: Answer[];
}