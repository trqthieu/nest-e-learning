import { Module } from '@nestjs/common';
import { CourseSectionsService } from './course-sections.service';
import { CourseSectionsController } from './course-sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { CourseSection } from 'src/entities/course-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseSection])],
  controllers: [CourseSectionsController],
  providers: [CourseSectionsService],
})
export class CourseSectionsModule {}
