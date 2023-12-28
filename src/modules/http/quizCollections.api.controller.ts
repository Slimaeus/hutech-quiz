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
import { QuizCollectionFormValues } from "../../models/quizCollection";
import { PrismaClient } from "@prisma/client";
import { QuizCollectionsService } from "../../libs/services/quizCollections.service";

@JsonController("/api/v1/quizzes", { transformResponse: true })
class QuizCollectionsController {
  quizzeService: QuizCollectionsService = new QuizCollectionsService();

  prisma: PrismaClient = new PrismaClient();

  @HttpCode(200)
  @Authorized()
  @Get()
  getQuizCollectionCollections() {
    return this.quizzeService.getMany();
  }

  @HttpCode(200)
  @Get("/:quizId")
  getQuizCollection(@Param("quizId") quizId: string) {
    return this.quizzeService.get(quizId);
  }

  @HttpCode(201)
  @Post()
  insertQuizCollection(@Body() quizFormValues: QuizCollectionFormValues) {
    return this.quizzeService.create(quizFormValues);
  }

  @HttpCode(204)
  @Put("/:quizId")
  async updateQuizCollection(
    @Param("quizId") quizId: string,
    @Body() quizFormValues: QuizCollectionFormValues
  ) {
    await this.quizzeService.update(quizId, quizFormValues);
  }

  @HttpCode(204)
  @Delete("/:quizId")
  deleteQuizCollection(@Param("quizId") quizId: string) {
    return this.quizzeService.delete(quizId);
  }
}

export default QuizCollectionsController;