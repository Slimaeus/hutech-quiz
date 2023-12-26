"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizFormValues = exports.Quiz = void 0;
class Quiz {
    /**
     * @param {string} content The quiz's content
     * @param {string} explaination The explaination of this quiz
     * @param {Answer[]} answers All the answers available
     */
    constructor(content, explaination, answers) {
        this.content = content;
        this.explaination = explaination;
        this.answers = answers;
    }
}
exports.Quiz = Quiz;
class QuizFormValues {
}
exports.QuizFormValues = QuizFormValues;
//# sourceMappingURL=quiz.js.map