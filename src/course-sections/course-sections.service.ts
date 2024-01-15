import { Injectable } from '@nestjs/common';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';
import { CourseSection } from 'src/entities/course-section.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

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

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.courseSectionRepo.createQueryBuilder('course_section');
    queryBuilder
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.courseUnits', 'course_unit')
      .orderBy('course_section.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
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
    return await this.courseSectionRepo.softDelete({
      id: +id,
    });
  }
}
