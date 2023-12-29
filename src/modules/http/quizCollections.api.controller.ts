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
import { QuizCollectionFormValues } from "../../models/quizCollection";
import { PrismaClient } from "@prisma/client";
import { QuizCollectionsService } from "../../libs/services/quizCollections.service";
import { Service } from "typedi";

@Service()
@JsonController("/api/v1/quizCollections", { transformResponse: true })
class QuizCollectionsController {
  prisma: PrismaClient = new PrismaClient();

  constructor(
    private readonly quizCollectionsService: QuizCollectionsService
  ) {}

  @HttpCode(200)
  @Authorized()
  @Get()
  getQuizCollectionCollections() {
    return this.quizCollectionsService.getMany();
  }

  @HttpCode(200)
  @Get("/:quizCollectionId")
  getQuizCollection(@Param("quizCollectionId") quizCollectionId: string) {
    return this.quizCollectionsService.get(quizCollectionId);
  }

  @HttpCode(201)
  @Post()
  insertQuizCollection(@Body() quizFormValues: QuizCollectionFormValues) {
    return this.quizCollectionsService.create(quizFormValues);
  }

  @OnUndefined(204)
  @Put("/:quizCollectionId")
  updateQuizCollection(
    @Param("quizCollectionId") quizCollectionId: string,
    @Body() quizFormValues: QuizCollectionFormValues
  ) {
    return this.quizCollectionsService.update(quizCollectionId, quizFormValues);
  }

  @HttpCode(200)
  @Delete("/:quizCollectionId")
  deleteQuizCollection(@Param("quizCollectionId") quizCollectionId: string) {
    return this.quizCollectionsService.delete(quizCollectionId);
  }
}

export default QuizCollectionsController;
