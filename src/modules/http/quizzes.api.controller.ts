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
  OnUndefined,
} from "routing-controllers";
import { QuizFormValues } from "../../models/quiz";
import { PrismaClient } from "@prisma/client";
import { QuizzesService } from "../../libs/services/quizzes.service";
import { Service } from "typedi";

@Service()
@JsonController("/api/v1/quizzes", { transformResponse: true })
class QuizzesController {
  prisma: PrismaClient = new PrismaClient();

  constructor(private readonly quizzesService: QuizzesService) {}

  @HttpCode(200)
  @Authorized()
  @Get()
  getQuizzes() {
    return this.quizzesService.getMany();
  }

  @HttpCode(200)
  @Get("/:quizId")
  getQuiz(@Param("quizId") quizId: string) {
    return this.quizzesService.get(quizId);
  }

  @HttpCode(201)
  @Post()
  insertQuiz(@Body() quizFormValues: QuizFormValues) {
    return this.quizzesService.create(quizFormValues);
  }

  @HttpCode(200)
  @Post("many")
  insertQuizzes(@Body() quizzes: Array<any>) {
    quizzes.forEach(async (e) => {
      const formValues = new QuizFormValues();
      formValues.content = e.content;
      formValues.explaination = e.explaination;
      formValues.score = 1;
      formValues.answers = e.answers;
      await this.quizzesService.create(formValues);
    });
  }

  @OnUndefined(204)
  @Put("/:quizId")
  updateQuiz(
    @Param("quizId") quizId: string,
    @Body() quizFormValues: QuizFormValues
  ) {
    return this.quizzesService.update(quizId, quizFormValues);
  }

  @HttpCode(200)
  @Delete("/:quizId")
  deleteQuiz(@Param("quizId") quizId: string) {
    return this.quizzesService.delete(quizId);
  }
}

export default QuizzesController;
