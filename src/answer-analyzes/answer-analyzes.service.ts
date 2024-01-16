import { Injectable } from '@nestjs/common';
import { CreateAnswerAnalyzeDto } from './dto/create-answer-analyze.dto';
import { UpdateAnswerAnalyzeDto } from './dto/update-answer-analyze.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Question } from 'src/entities/question.entity';
import { AnswerAnalyze } from 'src/entities/answer-analyze.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class AnswerAnalyzesService {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(AnswerAnalyze)
    private answerAnalyzeRepo: Repository<AnswerAnalyze>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(createAnswerAnalyzeDto: CreateAnswerAnalyzeDto) {
    const question = await this.questionRepo.findOneBy({
      id: createAnswerAnalyzeDto.questionId,
    });
    const user = await this.userRepo.findOneBy({
      id: createAnswerAnalyzeDto.authorId,
    });
    const answerAnalyze = await this.answerAnalyzeRepo.create({
      ...createAnswerAnalyzeDto,
      question: question,
      author: user,
    });
    return await this.answerAnalyzeRepo.save(answerAnalyze);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.answerAnalyzeRepo.createQueryBuilder('answer_analyze');
    queryBuilder
      .leftJoinAndSelect('answer_analyze.question', 'question')
      .leftJoinAndSelect('answer_analyze.author', 'user')
      .orderBy('answer_analyze.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.answerAnalyzeRepo.findOne({
      where: {
        id,
      },
      relations: {
        question: true,
        author: true,
      },
    });
  }

  async update(id: number, updateAnswerAnalyzeDto: UpdateAnswerAnalyzeDto) {
    const question = await this.questionRepo.findOneBy({
      id: updateAnswerAnalyzeDto.questionId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateAnswerAnalyzeDto.authorId,
    });
    const answerAnalyze = await this.answerAnalyzeRepo.create({
      id: id,
      ...updateAnswerAnalyzeDto,
      question: question,
      author: user,
    });
    return await this.answerAnalyzeRepo.save(answerAnalyze);
  }

  async remove(id: number) {
    return await this.answerAnalyzeRepo.softDelete({
      id: +id,
    });
  }
}
