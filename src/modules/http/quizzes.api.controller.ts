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
  @Get("/:id")
  getQuiz(@Param("id") id: string) {
    return this.quizzeService.get(id);
  }

  @HttpCode(201)
  @Post()
  insertQuiz(@Body() quizFormValues: QuizFormValues) {
    return this.quizzeService.create(quizFormValues);
  }

  @HttpCode(204)
  @Put("/:id")
  async updateQuiz(
    @Param("id") id: string,
    @Body() quizFormValues: QuizFormValues
  ) {
    await this.quizzeService.update(id, quizFormValues);
  }

  @HttpCode(204)
  @Delete("/:id")
  deleteQuiz(@Param("id") id: string) {
    return this.quizzeService.delete(id);
  }
}

export default QuizzesController;
