import { Module } from '@nestjs/common';
import { UserCourseUnitService } from './user-course-unit.service';
import { UserCourseUnitController } from './user-course-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { User } from 'src/entities/user.entity';
import { UserCourseUnit } from 'src/entities/user-courseunit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseUnit, User, UserCourseUnit])],
  controllers: [UserCourseUnitController],
  providers: [UserCourseUnitService],
})
export class UserCourseUnitModule {}
