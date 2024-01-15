import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { Exercise } from 'src/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseUnit, Exercise])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
