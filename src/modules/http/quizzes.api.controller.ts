import {
  JsonController,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  Authorized,
} from "routing-controllers";
import { QuizFormValues } from "../../models/quiz";
import { PrismaClient } from "@prisma/client";
import { QuizzesService } from "../../libs/services/quizzes.service";

@JsonController("/api/v1/quizzes", { transformResponse: true })
class QuizzesController {
  quizzeService: QuizzesService = new QuizzesService();

  prisma: PrismaClient = new PrismaClient();

  @HttpCode(200)
  @Authorized()
  @Get()
  getQuizzes() {
    return this.quizzeService.getMany();
  }

  @HttpCode(200)
  @Get("/:quizId")
  getQuiz(@Param("quizId") quizId: string) {
    return this.quizzeService.get(quizId);
  }

  @HttpCode(201)
  @Post()
  insertQuiz(@Body() quizFormValues: QuizFormValues) {
    return this.quizzeService.create(quizFormValues);
  }

  @HttpCode(204)
  @Put("/:quizId")
  async updateQuiz(
    @Param("quizId") quizId: string,
    @Body() quizFormValues: QuizFormValues
  ) {
    await this.quizzeService.update(quizId, quizFormValues);
  }

  @HttpCode(204)
  @Delete("/:quizId")
  deleteQuiz(@Param("quizId") quizId: string) {
    return this.quizzeService.delete(quizId);
  }
}

export default QuizzesController;
