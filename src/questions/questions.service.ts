import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { Exercise } from 'src/entities/exercise.entity';
import { QuestionSelect } from 'src/entities/question-select.entity';
import { Question } from 'src/entities/question.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { EQuestionType } from 'src/utils/enum/question-type.enum';
import { Between, In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionDto } from './dto/get-question.dto';
import { OrderQuestionDto } from './dto/order-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FilesService } from 'src/files/files.service';
import { ErrorMessage } from 'src/utils/constants/error-message.constant';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { EAnswerType } from 'src/utils/enum/answer-type.enum';
import { shuffleOrderWithinItems } from 'src/utils';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(QuestionSelect)
    private questionSelectRepo: Repository<QuestionSelect>,
    private filesService: FilesService,
  ) {}

  async importFile(examId: number, file: Express.Multer.File) {
    const oldQuestion = await this.findAll({
      examId: examId,
      skip: 0,
    });
    const totalOldQuestion = oldQuestion.meta.totalItem;
    const data = await this.filesService.getDataFromExcel(file);
    console.log('data', data);
    const listKey = ['question', 'answerA', 'answerB', 'answerC', 'answerD'];
    for (const [index, item] of data.entries()) {
      if (item.length !== listKey.length) {
        throw new BadRequestException(ErrorMessage.MISSING_DATA);
      }
      const userObject = {
        question: item[0],
        answerA: item[1],
        answerB: item[2],
        answerC: item[3],
        answerD: item[4],
      };
      const selectionsData = [
        {
          key: item[1],
          isCorrect: true,
          order: 0,
          questionId: 0,
          video: null,
          image: null,
          audio: null,
        },
        {
          key: item[2],
          isCorrect: false,
          order: 1,
          questionId: 0,
          video: null,
          image: null,
          audio: null,
        },
        {
          key: item[3],
          isCorrect: false,
          order: 2,
          questionId: 0,
          video: null,
          image: null,
          audio: null,
        },
        {
          key: item[4],
          isCorrect: false,
          order: 3,
          questionId: 0,
          video: null,
          image: null,
          audio: null,
        },
      ];
      const shuffleData = shuffleOrderWithinItems(selectionsData);
      const dataQuestion: CreateQuestionDto = {
        answerType: EAnswerType.SELECTION,
        audio: null,
        examId: examId,
        exerciseId: 0,
        order: index + totalOldQuestion,
        questionType: EQuestionType.EXAM,
        selections: shuffleData,
        title: item[0],
      };

      await this.create(dataQuestion);
      //   emailList.push(userObject.email);
      //   const existedUser = await this.userRepo.findOne({
      //     where: {
      //       email: userObject.email,
      //     },
      //   });
      //   if (existedUser) {
      //     throw new BadRequestException(ErrorMessage.EMAIL_HAS_EXISTED);
      //   }
      //   const hash = await hashPassword(userObject.password);
      //   const user = { ...userObject, password: hash };
      //   userList.push(user);
      // }
      // return await this.userRepo.save([...userList]);
    }
    return 'ok';
  }

  async create(createQuestionDto: CreateQuestionDto) {
    const exercise = await this.exerciseRepo.findOneBy({
      id: createQuestionDto.exerciseId,
    });
    const exam = await this.examRepo.findOneBy({
      id: createQuestionDto.examId,
    });
    const questionPayload = createQuestionDto.exerciseId
      ? {
          ...createQuestionDto,
          exercise: exercise,
          exam: exam,
        }
      : {
          ...createQuestionDto,
          exercise: exercise,
          exam: exam,
        };
    console.log('exercise', exercise);
    console.log('exam', exam);
    const question = await this.questionRepo.create(questionPayload);
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
    const { activeId, overId, type } = orderQuestionDto;
    const queryBuilder = this.questionRepo.createQueryBuilder('question');
    const activeQuestion = await this.questionRepo.findOne({
      where: {
        id: activeId,
      },
      relations: {
        exercise: true,
        exam: true,
      },
      select: {
        exercise: {
          id: true,
        },
        exam: {
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
        exam: true,
      },
      select: {
        exercise: {
          id: true,
        },
        exam: {
          id: true,
        },
      },
    });
    const activeOrder = activeQuestion.order;
    const overOrder = overQuestion.order;
    const rangeCondition =
      type === EQuestionType.EXERCISE
        ? {
            exercise: {
              id: activeQuestion.exercise.id,
            },
            order: Between(
              activeOrder > overOrder ? overOrder : activeOrder,
              activeOrder > overOrder ? activeOrder : overOrder,
            ),
          }
        : {
            exam: {
              id: activeQuestion.exam.id,
            },
            order: Between(
              activeOrder > overOrder ? overOrder : activeOrder,
              activeOrder > overOrder ? activeOrder : overOrder,
            ),
          };
    const rangeQuestion = await this.questionRepo.find({
      where: rangeCondition,
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
    const { exerciseId, examId } = getQuestionDto;
    const expression = exerciseId
      ? {
          exerciseId: getQuestionDto.exerciseId,
        }
      : examId
      ? {
          examId: getQuestionDto.examId,
        }
      : {};
    const where = exerciseId
      ? 'question.exercise = :exerciseId'
      : 'question.exam = :examId';
    queryBuilder
      .where(where, expression)
      .leftJoinAndSelect('question.exercise', 'exercise')
      .leftJoinAndSelect('question.exam', 'exam')
      .leftJoinAndSelect('question.questionSelects', 'question_select')
      .orderBy('question.createdAt', getQuestionDto.order)
      .orderBy('question_select.order', 'ASC')
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
    const questionSelectQueryBuilder =
      this.questionSelectRepo.createQueryBuilder('question_select');
    const exercise = await this.exerciseRepo.findOne({
      where: { id: updateQuestionDto.exerciseId },
    });
    const exam = await this.examRepo.findOne({
      where: { id: updateQuestionDto.examId },
    });
    const type = updateQuestionDto.questionType;
    const questionPayload =
      type === EQuestionType.EXERCISE
        ? {
            id: id,
            ...updateQuestionDto,
            exercise: exercise,
          }
        : {
            id: id,
            ...updateQuestionDto,
            exam: exam,
          };
    const question = await this.questionRepo.create(questionPayload);
    const savedQuestion = await this.questionRepo.save(question);

    const updatedQuestion = await this.questionRepo.findOne({
      where: { id },
      relations: {
        questionSelects: true,
      },
    });
    const initSelectionIds = updatedQuestion.questionSelects.map(
      (selection) => selection.id,
    );
    const selections = updateQuestionDto.selections;
    const restSelectionIds = selections
      .filter((selection) => selection.id)
      .map((item) => item.id);
    const removeIds = initSelectionIds.filter(
      (initId) => !restSelectionIds.includes(initId),
    );
    await questionSelectQueryBuilder
      .update(QuestionSelect)
      .set({
        deletedAt: new Date(),
      })
      .where({
        id: In(removeIds),
      })
      .execute();
    const selectionsMap = selections.map((selection) => ({
      ...selection,
      question: savedQuestion,
    }));
    const answers = await this.questionSelectRepo.create(selectionsMap);
    await this.questionSelectRepo.save(answers);
    return savedQuestion;
  }

  async remove(id: number) {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: {
        exercise: true,
        exam: true,
      },
    });
    const type = question.questionType;
    const greaterCondition =
      type === EQuestionType.EXERCISE
        ? {
            exercise: {
              id: question.exercise.id,
            },
            order: MoreThan(question.order),
          }
        : {
            exam: {
              id: question.exam.id,
            },
            order: MoreThan(question.order),
          };
    const greaterOrderQuestion = await this.questionRepo.find({
      where: greaterCondition,
    });
    const greaterIds = greaterOrderQuestion.map((question) => question.id);
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
