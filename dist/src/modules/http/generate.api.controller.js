"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const quizzes_service_1 = require("../../libs/services/quizzes.service");
let GenerateController = class GenerateController {
    constructor(quizzesService) {
        this.quizzesService = quizzesService;
    }
    getMessage(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const quizCount = 2;
            const answerCount = 4;
            const correctAnswerText = 1;
            const prompt = `Sinh cho tôi chính xác ${quizCount} câu đố trắc nghiệm (quiz) về ${topic} có chính xác ${answerCount} câu trả lời cho mỗi câu đố với đúng ${correctAnswerText} câu trả lời đúng trong mỗi câu.
    Cũng như tạo cho tôi một câu giải thích (explaination) hợp lý cho đáp án đúng.
    Nhưng bạn cần phải trả lời dưới dạng 1 JSON của câu đố! Cũng KHÔNG được dùng json markdown tức không bao giờ được có chuỗi này ""\`\`\`"" cũng như không bắt đầu bằng ""\`\`\`json"". Nếu chỉ có 1 câu đố vẫn phải để trong mảng!
    Ví dụ:
    [
        {{
            ""content"": ""Nội dung câu đố"",
            ""explaination"": ""Giải thích tại sao các đáp án lại đúng"",
            ""answers"": [
                {{
                    ""content"": ""Câu trả lời 1"",
                    ""isCorrect"": true
                }},
                {{
                    ""content"": ""Câu trả lời 2"",
                    ""isCorrect"": false
                }},
            ]
        }}
    ]`;
            const result = yield model.generateContent(prompt);
            const response = result.response;
            let text = response.text();
            console.log("Raw text");
            console.log(text);
            if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.startsWith("json")) {
                text = text.substring(4);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length - 3);
            }
            const quizzes = JSON.parse(text);
            // quizzes.forEach(async (e) => {
            //   const formValues = new QuizFormValues();
            //   formValues.content = e.content;
            //   formValues.explaination = e.explaination;
            //   formValues.score = 1;
            //   formValues.answers = e.answers;
            //   await this.quizzesService.create(formValues);
            // });
            console.log("Quizzes");
            console.log(quizzes);
            return quizzes;
        });
    }
    postMessage(topic, quizCount = 1, answerCount = 4, correctAnswerText = 4) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(topic);
            console.log(quizCount);
            console.log(answerCount);
            console.log(correctAnswerText);
            const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Sinh cho tôi chính xác ${quizCount} câu đố trắc nghiệm (quiz) về ${topic} có chính xác ${answerCount} câu trả lời cho mỗi câu đố với đúng ${correctAnswerText} câu trả lời đúng trong mỗi câu.
    Cũng như tạo cho tôi một câu giải thích (explaination) hợp lý cho đáp án đúng.
    Nhưng bạn cần phải trả lời dưới dạng 1 JSON của câu đố! Cũng KHÔNG được dùng json markdown tức không bao giờ được có chuỗi này ""\`\`\`"" cũng như không bắt đầu bằng ""\`\`\`json"" và sử dụng \\" thay vì " . Nếu chỉ có 1 câu đố vẫn phải để trong mảng!
    Ví dụ:
    [
        {{
            ""content"": ""Nội dung câu đố"",
            ""explaination"": ""Giải thích tại sao các đáp án lại đúng"",
            ""answers"": [
                {{
                    ""content"": ""Câu trả lời 1"",
                    ""isCorrect"": true
                }},
                {{
                    ""content"": ""Câu trả lời 2"",
                    ""isCorrect"": false
                }},
            ]
        }}
    ]`;
            const result = yield model.generateContent(prompt);
            const response = result.response;
            let text = response.text();
            console.log("Raw text");
            console.log(text);
            if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.startsWith("json")) {
                text = text.substring(4);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length - 3);
            }
            const quizzes = JSON.parse(text);
            console.log("Quizzes");
            console.log(quizzes);
            return quizzes;
        });
    }
};
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Get)("/:topic"),
    __param(0, (0, routing_controllers_1.Param)("topic")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenerateController.prototype, "getMessage", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Post)(),
    __param(0, (0, routing_controllers_1.BodyParam)("topic")),
    __param(1, (0, routing_controllers_1.BodyParam)("quizCount")),
    __param(2, (0, routing_controllers_1.BodyParam)("answerCount")),
    __param(3, (0, routing_controllers_1.BodyParam)("correctAnswerText")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], GenerateController.prototype, "postMessage", null);
GenerateController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/api/v1/generate", { transformResponse: true }),
    __metadata("design:paramtypes", [quizzes_service_1.QuizzesService])
], GenerateController);
exports.default = GenerateController;
