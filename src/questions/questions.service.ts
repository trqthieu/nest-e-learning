import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from 'src/entities/exercise.entity';
import { Question } from 'src/entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}
  async create(createQuestionDto: CreateQuestionDto) {
    const exercise = await this.exerciseRepo.findOneBy({
      id: createQuestionDto.exerciseId,
    });
    const question = await this.questionRepo.create({
      ...createQuestionDto,
      exercise: exercise,
    });
    return await this.questionRepo.save(question);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.questionRepo.createQueryBuilder('question');
    queryBuilder
      .leftJoinAndSelect('question.exercise', 'exercise')
      .leftJoinAndSelect('question.questionSelects', 'question_select')
      .orderBy('question.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
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
    return await this.questionRepo.save(question);
  }

  async remove(id: number) {
    return await this.questionRepo.softDelete({
      id: +id,
    });
  }
}
