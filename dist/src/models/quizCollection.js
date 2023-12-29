"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizCollectionFormValues = void 0;
class QuizCollectionFormValues {
    static toFormValues(quizCollection) {
        const quizCollectionFormValues = new QuizCollectionFormValues();
        quizCollectionFormValues.name = quizCollection.name;
        return quizCollectionFormValues;
    }
}
exports.QuizCollectionFormValues = QuizCollectionFormValues;
