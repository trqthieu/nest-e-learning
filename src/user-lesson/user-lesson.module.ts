import { Module } from '@nestjs/common';
import { UserLessonService } from './user-lesson.service';
import { UserLessonController } from './user-lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { UserLesson } from 'src/entities/user-lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, User, UserLesson])],
  controllers: [UserLessonController],
  providers: [UserLessonService],
})
export class UserLessonModule {}
