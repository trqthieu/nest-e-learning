import { Injectable } from '@nestjs/common';
import { CreateQuestionSelectDto } from './dto/create-question-select.dto';
import { UpdateQuestionSelectDto } from './dto/update-question-select.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/entities/question.entity';
import { QuestionSelect } from 'src/entities/question-select.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class QuestionSelectsService {
  constructor(
    @InjectRepository(QuestionSelect)
    private questionSelectRepo: Repository<QuestionSelect>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}
  async create(createQuestionSelectDto: CreateQuestionSelectDto) {
    const question = await this.questionRepo.findOneBy({
      id: createQuestionSelectDto.questionId,
    });
    const questionSelect = await this.questionSelectRepo.create({
      ...createQuestionSelectDto,
      question: question,
    });
    return await this.questionSelectRepo.save(questionSelect);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.questionSelectRepo.createQueryBuilder('question_select');
    queryBuilder
      .leftJoinAndSelect('question_select.question', 'question')
      .orderBy('question_select.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.questionSelectRepo.findOne({
      where: {
        id,
      },
      relations: {
        question: true,
      },
    });
  }

  async update(id: number, updateQuestionSelectDto: UpdateQuestionSelectDto) {
    const question = await this.questionRepo.findOneBy({
      id: updateQuestionSelectDto.questionId,
    });
    const questionSelect = await this.questionSelectRepo.create({
      id: id,
      ...updateQuestionSelectDto,
      question: question,
    });
    return await this.questionSelectRepo.save(questionSelect);
  }

  async remove(id: number) {
    return await this.questionSelectRepo.softDelete({
      id: +id,
    });
  }
}
