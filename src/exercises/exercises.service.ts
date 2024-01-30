import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { Exercise } from 'src/entities/exercise.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Between, In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { GetExerciseDto } from './dto/get-exercise.dto';
import { OrderExerciseDto } from './dto/order-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

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

  async changeOrder(orderExerciseDto: OrderExerciseDto) {
    const { activeId, overId } = orderExerciseDto;
    const queryBuilder = this.exerciseRepo.createQueryBuilder('exercise');
    const activeExercise = await this.exerciseRepo.findOne({
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
    const overExercise = await this.exerciseRepo.findOne({
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
    const activeOrder = activeExercise.order;
    const overOrder = overExercise.order;

    const rangeExercise = await this.exerciseRepo.find({
      where: {
        courseUnit: {
          id: activeExercise.courseUnit.id,
        },
        order: Between(
          activeOrder > overOrder ? overOrder : activeOrder,
          activeOrder > overOrder ? activeOrder : overOrder,
        ),
      },
    });
    const rangeId = rangeExercise.map((exercise) => exercise.id);
    let result: UpdateResult;
    if (activeOrder > overOrder) {
      result = await queryBuilder
        .update(Exercise)
        .set({
          order() {
            return 'order + 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.exerciseRepo.update(activeExercise.id, {
        order: overExercise.order,
      });
    } else {
      result = await queryBuilder
        .update(Exercise)
        .set({
          order() {
            return 'order - 1';
          },
        })
        .where({
          id: In(rangeId),
        })
        .execute();
      await this.exerciseRepo.update(activeExercise.id, {
        order: overExercise.order,
      });
    }
    return result;
  }

  async findAll(getExerciseDto: GetExerciseDto) {
    const queryBuilder = this.exerciseRepo.createQueryBuilder('exercise');
    queryBuilder
      .where('exercise.courseUnit = :courseUnitId', {
        courseUnitId: getExerciseDto.courseUnitId,
      })
      .leftJoinAndSelect('exercise.courseUnit', 'course_unit')
      .orderBy('exercise.createdAt', getExerciseDto.order)
      .skip(getExerciseDto.skip)
      .take(getExerciseDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getExerciseDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.exerciseRepo.findOne({
      where: {
        id,
      },
      relations: {
        courseUnit: true,
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
    const exercise = await this.exerciseRepo.findOne({
      where: { id },
      relations: {
        courseUnit: true,
      },
    });
    const greaterOrderExercise = await this.exerciseRepo.find({
      where: {
        courseUnit: {
          id: exercise.courseUnit.id,
        },
        order: MoreThan(exercise.order),
      },
    });
    const greaterIds = greaterOrderExercise.map((exercise) => exercise.id);
    const queryBuilder = this.exerciseRepo.createQueryBuilder('exercise');
    await queryBuilder
      .update(Exercise)
      .set({
        order() {
          return 'order -1';
        },
      })
      .where({
        id: In(greaterIds),
      })
      .execute();
    return await this.exerciseRepo.softDelete({
      id: +id,
    });
  }
}
