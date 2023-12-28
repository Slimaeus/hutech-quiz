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

@JsonController("/api/v1/quizCollections", { transformResponse: true })
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
  @Get("/:quizCollectionId")
  getQuizCollection(@Param("quizCollectionId") quizCollectionId: string) {
    return this.quizzeService.get(quizCollectionId);
  }

  @HttpCode(201)
  @Post()
  insertQuizCollection(@Body() quizFormValues: QuizCollectionFormValues) {
    return this.quizzeService.create(quizFormValues);
  }

  @HttpCode(204)
  @Put("/:quizCollectionId")
  async updateQuizCollection(
    @Param("quizCollectionId") quizCollectionId: string,
    @Body() quizFormValues: QuizCollectionFormValues
  ) {
    await this.quizzeService.update(quizCollectionId, quizFormValues);
  }

  @HttpCode(204)
  @Delete("/:quizCollectionId")
  deleteQuizCollection(@Param("quizCollectionId") quizCollectionId: string) {
    return this.quizzeService.delete(quizCollectionId);
  }
}

export default QuizCollectionsController;