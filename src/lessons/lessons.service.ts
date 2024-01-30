import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Between, In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { GetLessonDto } from './dto/get-lesson.dto';
import { OrderLessonDto } from './dto/order-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(CourseUnit)
    private courseUnitRepo: Repository<CourseUnit>,
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
  ) {}
  async create(createLessonDto: CreateLessonDto) {
    const courseUnit = await this.courseUnitRepo.findOneBy({
      id: createLessonDto.courseUnitId,
    });
    const lesson = await this.lessonRepo.create({
      ...createLessonDto,
      courseUnit: courseUnit,
    });
    return await this.lessonRepo.save(lesson);
  }

  async changeOrder(orderLessonDto: OrderLessonDto) {
    const { activeId, overId } = orderLessonDto;
    const queryBuilder = this.lessonRepo.createQueryBuilder('lesson');
    const activeLesson = await this.lessonRepo.findOne({
      where: {
        id: activeId,
      },
      relations: {
        courseUnit: true,
      },
      select: {
        courseUnit: {
          id: true,
        },
      },
    });
    const overLesson = await this.lessonRepo.findOne({
      where: {
        id: overId,
      },
      relations: {
        courseUnit: true,
      },
      select: {
        courseUnit: {
          id: true,
        },
      },
    });
    const activeOrder = activeLesson.order;
    const overOrder = overLesson.order;

    const rangeLesson = await this.lessonRepo.find({
      where: {
        courseUnit: {
          id: activeLesson.courseUnit.id,
        },
        order: Between(
          activeOrder > overOrder ? overOrder : activeOrder,
          activeOrder > overOrder ? activeOrder : overOrder,
        ),
      },
    });
    const rangeId = rangeLesson.map((lesson) => lesson.id);
    let result: UpdateResult;
    if (activeOrder > overOrder) {
      result = await queryBuilder
        .update(Lesson)
        .set({
          order() {
            return 'order + 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.lessonRepo.update(activeLesson.id, {
        order: overLesson.order,
      });
    } else {
      result = await queryBuilder
        .update(Lesson)
        .set({
          order() {
            return 'order - 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.lessonRepo.update(activeLesson.id, {
        order: overLesson.order,
      });
    }
    return result;
  }

  async findAll(getLessonDto: GetLessonDto) {
    const queryBuilder = this.lessonRepo.createQueryBuilder('lesson');
    queryBuilder
      .where('lesson.courseUnit = :courseUnitId', {
        courseUnitId: getLessonDto.courseUnitId,
      })
      .leftJoinAndSelect('lesson.courseUnit', 'course_unit')
      .orderBy('lesson.createdAt', getLessonDto.order)
      .skip(getLessonDto.skip)
      .take(getLessonDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getLessonDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.lessonRepo.findOne({
      where: {
        id,
      },
      relations: {
        courseUnit: true,
      },
    });
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    const courseUnit = await this.courseUnitRepo.findOneBy({
      id: updateLessonDto.courseUnitId,
    });
    const lesson = await this.lessonRepo.create({
      id: id,
      ...updateLessonDto,
      courseUnit: courseUnit,
    });
    return await this.lessonRepo.save(lesson);
  }

  async remove(id: number) {
    const lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: {
        courseUnit: true,
      },
    });
    const greaterOrderLesson = await this.lessonRepo.find({
      where: {
        courseUnit: {
          id: lesson.courseUnit.id,
        },
        order: MoreThan(lesson.order),
      },
    });
    const greaterIds = greaterOrderLesson.map((lesson) => lesson.id);
    const queryBuilder = this.lessonRepo.createQueryBuilder('lesson');
    await queryBuilder
      .update(Lesson)
      .set({
        order() {
          return 'order -1';
        },
      })
      .where({
        id: In(greaterIds),
      })
      .execute();
    return await this.lessonRepo.softDelete({
      id: +id,
    });
  }
}
