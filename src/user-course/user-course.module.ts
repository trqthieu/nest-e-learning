import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { UserCourse } from 'src/entities/user-course.entity';
import { User } from 'src/entities/user.entity';
import { UserCourseController } from './user-course.controller';
import { UserCourseService } from './user-course.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, UserCourse])],
  controllers: [UserCourseController],
  providers: [UserCourseService],
})
export class UserCourseModule {}
