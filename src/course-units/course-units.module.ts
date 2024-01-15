import { Module } from '@nestjs/common';
import { CourseUnitsService } from './course-units.service';
import { CourseUnitsController } from './course-units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { CourseSection } from 'src/entities/course-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseUnit, CourseSection])],
  controllers: [CourseUnitsController],
  providers: [CourseUnitsService],
})
export class CourseUnitsModule {}
