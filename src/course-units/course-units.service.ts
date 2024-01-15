import { Injectable } from '@nestjs/common';
import { CreateCourseUnitDto } from './dto/create-course-unit.dto';
import { UpdateCourseUnitDto } from './dto/update-course-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { Repository } from 'typeorm';
import { CourseSection } from 'src/entities/course-section.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

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

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.courseUnitRepo.createQueryBuilder('course_unit');
    queryBuilder
      .leftJoinAndSelect('course_unit.courseSection', 'course_section')
      .leftJoinAndSelect('course_unit.exercises', 'exercise')
      .leftJoinAndSelect('course_unit.lessons', 'lesson')
      .orderBy('course_unit.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
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
    return await this.courseUnitRepo.softDelete({
      id: +id,
    });
  }
}
