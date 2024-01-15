import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { User } from 'src/entities/user.entity';
import { CourseGroup } from 'src/entities/course-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, CourseGroup])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
