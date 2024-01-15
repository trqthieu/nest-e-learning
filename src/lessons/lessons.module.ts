import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { Lesson } from 'src/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseUnit, Lesson])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
