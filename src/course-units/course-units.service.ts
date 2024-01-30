import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSection } from 'src/entities/course-section.entity';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Between, In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateCourseUnitDto } from './dto/create-course-unit.dto';
import { GetCourseUnitDto } from './dto/get-course-unit.dto';
import { UpdateCourseUnitDto } from './dto/update-course-unit.dto';
import { OrderCourseUnitDto } from './dto/order-course-unit.dto';

@Injectable()
export class CourseUnitsService {
  constructor(
    @InjectRepository(CourseUnit)
    private courseUnitRepo: Repository<CourseUnit>,
    @InjectRepository(CourseSection)
    private courseSectionRepo: Repository<CourseSection>,
  ) {}

  async create(createCourseUnitDto: CreateCourseUnitDto) {
    const courseSection = await this.courseSectionRepo.findOneBy({
      id: createCourseUnitDto.courseSectionId,
    });
    const courseUnit = await this.courseUnitRepo.create({
      ...createCourseUnitDto,
      courseSection: courseSection,
    });
    return await this.courseUnitRepo.save(courseUnit);
  }

  async changeOrder(orderCourseUnitDto: OrderCourseUnitDto) {
    const { activeId, overId } = orderCourseUnitDto;
    const queryBuilder = this.courseUnitRepo.createQueryBuilder('course_unit');
    const activeUnit = await this.courseUnitRepo.findOne({
      where: {
        id: activeId,
      },
      relations: {
        courseSection: true,
      },
      select: {
        courseSection: {
          id: true,
        },
      },
    });
    const overUnit = await this.courseUnitRepo.findOne({
      where: {
        id: overId,
      },
      relations: {
        courseSection: true,
      },
      select: {
        courseSection: {
          id: true,
        },
      },
    });
    const activeOrder = activeUnit.order;
    const overOrder = overUnit.order;

    const rangeUnit = await this.courseUnitRepo.find({
      where: {
        courseSection: {
          id: activeUnit.courseSection.id,
        },
        order: Between(
          activeOrder > overOrder ? overOrder : activeOrder,
          activeOrder > overOrder ? activeOrder : overOrder,
        ),
      },
    });
    const rangeId = rangeUnit.map((unit) => unit.id);
    let result: UpdateResult;
    if (activeOrder > overOrder) {
      result = await queryBuilder
        .update(CourseUnit)
        .set({
          order() {
            return 'order + 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.courseUnitRepo.update(activeUnit.id, {
        order: overUnit.order,
      });
    } else {
      result = await queryBuilder
        .update(CourseUnit)
        .set({
          order() {
            return 'order - 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.courseUnitRepo.update(activeUnit.id, {
        order: overUnit.order,
      });
    }
    return result;
  }

  async findAll(getCourseUnitDto: GetCourseUnitDto) {
    const queryBuilder = this.courseUnitRepo.createQueryBuilder('course_unit');
    queryBuilder
      .where('course_unit.courseSection = :courseSectionId', {
        courseSectionId: getCourseUnitDto.courseSectionId,
      })
      .leftJoinAndSelect('course_unit.courseSection', 'course_section')
      .leftJoinAndSelect('course_unit.exercises', 'exercise')
      .leftJoinAndSelect('course_unit.lessons', 'lesson')
      .orderBy('course_unit.createdAt', getCourseUnitDto.order)
      .skip(getCourseUnitDto.skip)
      .take(getCourseUnitDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getCourseUnitDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.courseUnitRepo.findOne({
      where: {
        id,
      },
      relations: {
        courseSection: {
          course: true,
        },
        lessons: true,
        exercises: true,
      },
    });
  }

  async update(id: number, updateCourseUnitDto: UpdateCourseUnitDto) {
    const courseSection = await this.courseSectionRepo.findOneBy({
      id: updateCourseUnitDto.courseSectionId,
    });
    const courseUnit = await this.courseUnitRepo.create({
      id: id,
      ...updateCourseUnitDto,
      courseSection: courseSection,
    });
    return await this.courseUnitRepo.save(courseUnit);
  }

  async remove(id: number) {
    const courseUnit = await this.courseUnitRepo.findOne({
      where: { id },
      relations: {
        courseSection: true,
      },
    });
    const greaterOrderCourseUnit = await this.courseUnitRepo.find({
      where: {
        courseSection: {
          id: courseUnit.courseSection.id,
        },
        order: MoreThan(courseUnit.order),
      },
    });
    const greaterIds = greaterOrderCourseUnit.map(
      (courseUnit) => courseUnit.id,
    );
    const queryBuilder = this.courseUnitRepo.createQueryBuilder('course_unit');
    await queryBuilder
      .update(CourseUnit)
      .set({
        order() {
          return 'order -1';
        },
      })
      .where({
        id: In(greaterIds),
      })
      .execute();
    return await this.courseUnitRepo.softDelete({
      id: +id,
    });
  }
}
