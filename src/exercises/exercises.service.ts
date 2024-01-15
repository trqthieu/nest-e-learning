import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { Repository } from 'typeorm';
import { Exercise } from 'src/entities/exercise.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(CourseUnit)
    private courseUnitRepo: Repository<CourseUnit>,
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
  ) {}
  async create(createExerciseDto: CreateExerciseDto) {
    const courseUnit = await this.courseUnitRepo.findOneBy({
      id: createExerciseDto.courseUnitId,
    });
    const exercise = await this.exerciseRepo.create({
      ...createExerciseDto,
      courseUnit: courseUnit,
    });
    return await this.exerciseRepo.save(exercise);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.exerciseRepo.createQueryBuilder('exercise');
    queryBuilder
      .leftJoinAndSelect('exercise.courseUnit', 'course_unit')
      .orderBy('exercise.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.exerciseRepo.findOne({
      where: {
        id,
      },
      relations: {
        courseUnit: true,
        questions: true,
      },
    });
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    const courseUnit = await this.courseUnitRepo.findOneBy({
      id: updateExerciseDto.courseUnitId,
    });
    const exercise = await this.exerciseRepo.create({
      id: id,
      ...updateExerciseDto,
      courseUnit: courseUnit,
    });
    return await this.exerciseRepo.save(exercise);
  }

  async remove(id: number) {
    return await this.exerciseRepo.softDelete({
      id: +id,
    });
  }
}
