import { Injectable } from '@nestjs/common';
import { CreateExamReviewDto } from './dto/create-exam-review.dto';
import { UpdateExamReviewDto } from './dto/update-exam-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamReview } from 'src/entities/exam-review.entity';
import { User } from 'src/entities/user.entity';
import { Exam } from 'src/entities/exam.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class ExamReviewsService {
  constructor(
    @InjectRepository(ExamReview)
    private examReviewRepo: Repository<ExamReview>,
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createExamReviewDto: CreateExamReviewDto) {
    const exam = await this.examRepo.findOneBy({
      id: createExamReviewDto.examId,
    });
    const user = await this.userRepo.findOneBy({
      id: createExamReviewDto.authorId,
    });
    const examReview = await this.examReviewRepo.create({
      ...createExamReviewDto,
      exam: exam,
      author: user,
    });
    return await this.examReviewRepo.save(examReview);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.examReviewRepo.createQueryBuilder('exam_review');
    queryBuilder
      .leftJoinAndSelect('exam_review.exam', 'exam')
      .leftJoinAndSelect('exam_review.author', 'user')
      .orderBy('exam_review.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.examReviewRepo.findOne({
      where: {
        id,
      },
      relations: {
        exam: true,
        author: true,
      },
    });
  }

  async update(id: number, updateExamReviewDto: UpdateExamReviewDto) {
    const exam = await this.examRepo.findOneBy({
      id: updateExamReviewDto.examId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateExamReviewDto.authorId,
    });
    const lesson = await this.examReviewRepo.create({
      id: id,
      ...updateExamReviewDto,
      exam: exam,
      author: user,
    });
    return await this.examReviewRepo.save(lesson);
  }

  async remove(id: number) {
    return await this.examReviewRepo.softDelete({
      id: +id,
    });
  }
}
