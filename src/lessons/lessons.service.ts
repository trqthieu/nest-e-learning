import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/entities/lesson.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

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

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.lessonRepo.createQueryBuilder('lesson');
    queryBuilder
      .leftJoinAndSelect('lesson.courseUnit', 'course_unit')
      .orderBy('lesson.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
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
    return await this.lessonRepo.softDelete({
      id: +id,
    });
  }
}
