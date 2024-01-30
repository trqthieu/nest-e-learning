import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSection } from 'src/entities/course-section.entity';
import { Course } from 'src/entities/course.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Between, In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { GetCourseSectionDto } from './dto/get-course-section.dto';
import { OrderCourseSectionDto } from './dto/order-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';

@Injectable()
export class CourseSectionsService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(CourseSection)
    private courseSectionRepo: Repository<CourseSection>,
  ) {}
  async create(createCourseSectionDto: CreateCourseSectionDto) {
    const course = await this.courseRepo.findOneBy({
      id: createCourseSectionDto.courseId,
    });
    const courseSection = await this.courseSectionRepo.create({
      ...createCourseSectionDto,
      course: course,
    });
    return await this.courseSectionRepo.save(courseSection);
  }

  async changeOrder(orderCourseSectionDto: OrderCourseSectionDto) {
    const { activeId, overId } = orderCourseSectionDto;
    const queryBuilder =
      this.courseSectionRepo.createQueryBuilder('course_section');
    const activeSection = await this.courseSectionRepo.findOne({
      where: {
        id: activeId,
      },
      relations: {
        course: true,
      },
      select: {
        course: {
          id: true,
        },
      },
    });
    const overSection = await this.courseSectionRepo.findOne({
      where: {
        id: overId,
      },
      relations: {
        course: true,
      },
      select: {
        course: {
          id: true,
        },
      },
    });
    const activeOrder = activeSection.order;
    const overOrder = overSection.order;

    const rangeSection = await this.courseSectionRepo.find({
      where: {
        course: {
          id: activeSection.course.id,
        },
        order: Between(
          activeOrder > overOrder ? overOrder : activeOrder,
          activeOrder > overOrder ? activeOrder : overOrder,
        ),
      },
    });
    const rangeId = rangeSection.map((section) => section.id);
    let result: UpdateResult;
    if (activeOrder > overOrder) {
      result = await queryBuilder
        .update(CourseSection)
        .set({
          order() {
            return 'order + 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.courseSectionRepo.update(activeSection.id, {
        order: overSection.order,
      });
    } else {
      result = await queryBuilder
        .update(CourseSection)
        .set({
          order() {
            return 'order - 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.courseSectionRepo.update(activeSection.id, {
        order: overSection.order,
      });
    }
    return result;
  }

  async findAll(getCourseSectionDto: GetCourseSectionDto) {
    const queryBuilder =
      this.courseSectionRepo.createQueryBuilder('course_section');
    queryBuilder
      .where('course_section.courseId = :courseId', {
        courseId: getCourseSectionDto.courseId,
      })
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.courseUnits', 'course_unit')
      .orderBy('course_section.createdAt', getCourseSectionDto.order)
      .skip(getCourseSectionDto.skip)
      .take(getCourseSectionDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getCourseSectionDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.courseSectionRepo.findOne({
      where: {
        id,
      },
      relations: {
        course: true,
        courseUnits: true,
      },
    });
  }

  async update(id: number, updateCourseSectionDto: UpdateCourseSectionDto) {
    const course = await this.courseRepo.findOneBy({
      id: updateCourseSectionDto.courseId,
    });
    const courseSection = await this.courseSectionRepo.create({
      id: id,
      ...updateCourseSectionDto,
      course: course,
    });
    return await this.courseSectionRepo.save(courseSection);
  }

  async remove(id: number) {
    const courseSection = await this.courseSectionRepo.findOne({
      where: { id },
      relations: {
        course: true,
      },
    });
    const greaterOrderCourseSection = await this.courseSectionRepo.find({
      where: {
        course: {
          id: courseSection.course.id,
        },
        order: MoreThan(courseSection.order),
      },
    });
    const greaterIds = greaterOrderCourseSection.map(
      (courseSection) => courseSection.id,
    );
    const queryBuilder =
      this.courseSectionRepo.createQueryBuilder('course_section');
    await queryBuilder
      .update(CourseSection)
      .set({
        order() {
          return 'order -1';
        },
      })
      .where({
        id: In(greaterIds),
      })
      .execute();
    return await this.courseSectionRepo.softDelete({
      id: +id,
    });
  }
}
