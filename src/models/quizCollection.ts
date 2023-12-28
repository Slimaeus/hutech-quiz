
import { QuizCollection } from "@prisma/client";
export class QuizCollectionFormValues {
  name: string;

  static toFormValues(quizCollection: QuizCollection): QuizCollectionFormValues {
    const quizCollectionFormValues = new QuizCollectionFormValues();
    quizCollectionFormValues.name = quizCollection.name;
    return quizCollectionFormValues;
  }
}
