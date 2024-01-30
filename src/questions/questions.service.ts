import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from 'src/entities/exercise.entity';
import { QuestionSelect } from 'src/entities/question-select.entity';
import { Question } from 'src/entities/question.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Between, In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionDto } from './dto/get-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { OrderQuestionDto } from './dto/order-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(QuestionSelect)
    private questionSelectRepo: Repository<QuestionSelect>,
  ) {}
  async create(createQuestionDto: CreateQuestionDto) {
    const exercise = await this.exerciseRepo.findOneBy({
      id: createQuestionDto.exerciseId,
    });
    const question = await this.questionRepo.create({
      ...createQuestionDto,
      exercise: exercise,
    });
    const createdQuestion = await this.questionRepo.save(question);
    if (createQuestionDto?.selections?.length) {
      const selections = createQuestionDto.selections.map((selection) => ({
        ...selection,
        question: createdQuestion,
      }));
      const answers = await this.questionSelectRepo.create(selections);
      await this.questionSelectRepo.save(answers);
    }

    return createdQuestion;
  }

  async changeOrder(orderQuestionDto: OrderQuestionDto) {
    const { activeId, overId } = orderQuestionDto;
    const queryBuilder = this.questionRepo.createQueryBuilder('question');
    const activeQuestion = await this.questionRepo.findOne({
      where: {
        id: activeId,
      },
      relations: {
        exercise: true,
      },
      select: {
        exercise: {
          id: true,
        },
      },
    });
    const overQuestion = await this.questionRepo.findOne({
      where: {
        id: overId,
      },
      relations: {
        exercise: true,
      },
      select: {
        exercise: {
          id: true,
        },
      },
    });
    const activeOrder = activeQuestion.order;
    const overOrder = overQuestion.order;

    const rangeQuestion = await this.questionRepo.find({
      where: {
        exercise: {
          id: activeQuestion.exercise.id,
        },
        order: Between(
          activeOrder > overOrder ? overOrder : activeOrder,
          activeOrder > overOrder ? activeOrder : overOrder,
        ),
      },
    });
    const rangeId = rangeQuestion.map((question) => question.id);
    let result: UpdateResult;
    if (activeOrder > overOrder) {
      result = await queryBuilder
        .update(Question)
        .set({
          order() {
            return 'order + 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.questionRepo.update(activeQuestion.id, {
        order: overQuestion.order,
      });
    } else {
      result = await queryBuilder
        .update(Question)
        .set({
          order() {
            return 'order - 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.questionRepo.update(activeQuestion.id, {
        order: overQuestion.order,
      });
    }
    return result;
  }

  async findAll(getQuestionDto: GetQuestionDto) {
    const queryBuilder = this.questionRepo.createQueryBuilder('question');
    queryBuilder
      .where('question.exercise = :exerciseId', {
        exerciseId: getQuestionDto.exerciseId,
      })
      .leftJoinAndSelect('question.exercise', 'exercise')
      .leftJoinAndSelect('question.questionSelects', 'question_select')
      .orderBy('question.createdAt', getQuestionDto.order)
      .skip(getQuestionDto.skip)
      .take(getQuestionDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getQuestionDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.questionRepo.findOne({
      where: {
        id,
      },
      relations: {
        exercise: true,
        questionSelects: true,
      },
    });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const exercise = await this.exerciseRepo.findOneBy({
      id: updateQuestionDto.exerciseId,
    });
    const question = await this.questionRepo.create({
      id: id,
      ...updateQuestionDto,
      exercise: exercise,
    });
    const savedQuestion = await this.questionRepo.save(question);
    const selections = updateQuestionDto.selections;
    console.log('selections', selections);

    return savedQuestion;
  }

  async remove(id: number) {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: {
        exercise: true,
      },
    });
    const greaterOrderExercise = await this.questionRepo.find({
      where: {
        exercise: {
          id: question.exercise.id,
        },
        order: MoreThan(question.order),
      },
    });
    const greaterIds = greaterOrderExercise.map((question) => question.id);
    const queryBuilder = this.questionRepo.createQueryBuilder('question');
    await queryBuilder
      .update(Question)
      .set({
        order() {
          return 'order -1';
        },
      })
      .where({
        id: In(greaterIds),
      })
      .execute();
    return await this.questionRepo.softDelete({
      id: +id,
    });
  }
}
