import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz } from "@prisma/client";
import {
  BodyParam,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
} from "routing-controllers";
import { Service } from "typedi";
import { QuizzesService } from "../../libs/services/quizzes.service";
import { QuizFormValues } from "../../models/quiz";

@Service()
@JsonController("/api/v1/generate", { transformResponse: true })
class GenerateController {
  constructor(private readonly quizzesService: QuizzesService) {}
  @HttpCode(200)
  @Get("/:topic")
  async getMessage(@Param("topic") topic: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

    const result = await model.generateContent(prompt);
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
    const quizzes = JSON.parse(text) as Array<any>;
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
  }

  @HttpCode(200)
  @Post()
  async postMessage(
    @BodyParam("topic") topic: string,
    @BodyParam("quizCount") quizCount: number = 1,
    @BodyParam("answerCount") answerCount = 4,
    @BodyParam("correctAnswerText") correctAnswerText = 4
  ) {
    console.log(topic);
    console.log(quizCount);
    console.log(answerCount);
    console.log(correctAnswerText);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Sinh cho tôi chính xác ${quizCount} câu đố trắc nghiệm (quiz) về ${topic} có chính xác ${answerCount} câu trả lời cho mỗi câu đố với đúng ${correctAnswerText} câu trả lời đúng trong mỗi câu.
    Cũng như tạo cho tôi một câu giải thích (explaination) hợp lý cho đáp án đúng.
    Nhưng bạn cần phải trả lời dưới dạng 1 JSON của câu đố! Cũng KHÔNG được dùng json markdown tức không bao giờ được có chuỗi này ""\`\`\`"" cũng như không bắt đầu bằng ""\`\`\`json"" và SỬ DỤNG nháy đơn ' thay vì nháy kép " cho các phần nhấn mạnh, tên riêng bên trong nội dung (content) của câu hỏi, giải thich và câu trả lời. !!! ĐỪNG THAY THẾ ' CHO " TRONG CÁC TRƯỜNG JSON, VẪN SỬ DỤNG DẤU " CHO CÁC PHẦN CỦA JSON . Nếu chỉ có 1 câu đố vẫn phải để trong mảng!
    Ví dụ:
    [
        {{
            ""content"": ""Nội dung câu đố"",
            ""explaination"": ""Giải thích tại sao các đáp án lại đúng"",
            ""answers"": [f
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

    const result = await model.generateContent(prompt);
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
    const quizzes = JSON.parse(text) as Array<any>;
    console.log("Quizzes");
    console.log(quizzes);
    return quizzes;
  }
}

export default GenerateController;
