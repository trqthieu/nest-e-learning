import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { GetExamDto } from './dto/get-exam.dto';
import { User } from 'src/entities/user.entity';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(User)
    private authorRepo: Repository<User>,
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
  ) {}
  async create(createExamDto: CreateExamDto) {
    const author = await this.authorRepo.findOneBy({
      id: createExamDto.authorId,
    });
    const exam = await this.examRepo.create({
      ...createExamDto,
      author: author,
    });
    return await this.examRepo.save(exam);
  }

  // async changeOrder(orderExamDto: OrderExamDto) {
  //   const { activeId, overId } = orderExamDto;
  //   const queryBuilder = this.examRepo.createQueryBuilder('exam');
  //   const activeExam = await this.examRepo.findOne({
  //     where: {
  //       id: activeId,
  //     },
  //     relations: {
  //       author: true,
  //     },
  //     select: {
  //       author: {
  //         id: true,
  //       },
  //     },
  //   });
  //   const overExam = await this.examRepo.findOne({
  //     where: {
  //       id: overId,
  //     },
  //     relations: {
  //       author: true,
  //     },
  //     select: {
  //       author: {
  //         id: true,
  //       },
  //     },
  //   });
  //   const activeOrder = activeExam.order;
  //   const overOrder = overExam.order;

  //   const rangeExam = await this.examRepo.find({
  //     where: {
  //       author: {
  //         id: activeExam.author.id,
  //       },
  //       order: Between(
  //         activeOrder > overOrder ? overOrder : activeOrder,
  //         activeOrder > overOrder ? activeOrder : overOrder,
  //       ),
  //     },
  //   });
  //   const rangeId = rangeExam.map((exam) => exam.id);
  //   let result: UpdateResult;
  //   if (activeOrder > overOrder) {
  //     result = await queryBuilder
  //       .update(Exam)
  //       .set({
  //         order() {
  //           return 'order + 1';
  //         },
  //       })
  //       .where({
  //         id: In(rangeId),
  //       })
  //       .execute();
  //     await this.examRepo.update(activeExam.id, {
  //       order: overExam.order,
  //     });
  //   } else {
  //     result = await queryBuilder
  //       .update(Exam)
  //       .set({
  //         order() {
  //           return 'order - 1';
  //         },
  //       })
  //       .where({
  //         id: In(rangeId),
  //       })
  //       .execute();
  //     await this.examRepo.update(activeExam.id, {
  //       order: overExam.order,
  //     });
  //   }
  //   return result;
  // }

  async findAll(getExamDto: GetExamDto) {
    const queryBuilder = this.examRepo.createQueryBuilder('exam');
    queryBuilder
      // .where('exam.author = :authorId', {
      //   authorId: getExamDto.authorId,
      // })
      .leftJoinAndSelect('exam.author', 'course_unit')
      .orderBy('exam.createdAt', getExamDto.order)
      .skip(getExamDto.skip)
      .take(getExamDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getExamDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.examRepo.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const author = await this.authorRepo.findOneBy({
      id: updateExamDto.authorId,
    });
    const exam = await this.examRepo.create({
      id: id,
      ...updateExamDto,
      author: author,
    });
    return await this.examRepo.save(exam);
  }

  async remove(id: number) {
    // const exam = await this.examRepo.findOne({
    //   where: { id },
    //   relations: {
    //     author: true,
    //   },
    // });
    // const greaterOrderExam = await this.examRepo.find({
    //   where: {
    //     author: {
    //       id: exam.author.id,
    //     },
    //     order: MoreThan(exam.order),
    //   },
    // });
    // const greaterIds = greaterOrderExam.map((exam) => exam.id);
    // const queryBuilder = this.examRepo.createQueryBuilder('exam');
    // await queryBuilder
    //   .update(Exam)
    //   .set({
    //     order() {
    //       return 'order -1';
    //     },
    //   })
    //   .where({
    //     id: In(greaterIds),
    //   })
    //   .execute();
    return await this.examRepo.softDelete({
      id: +id,
    });
  }
}
