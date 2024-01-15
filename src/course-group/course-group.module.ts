import { Module } from '@nestjs/common';
import { CourseGroupService } from './course-group.service';
import { CourseGroupController } from './course-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseGroup } from 'src/entities/course-group.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseGroup, User])],
  controllers: [CourseGroupController],
  providers: [CourseGroupService],
})
export class CourseGroupModule {}
