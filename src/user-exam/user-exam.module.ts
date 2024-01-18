import { Module } from '@nestjs/common';
import { UserExamService } from './user-exam.service';
import { UserExamController } from './user-exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { User } from 'src/entities/user.entity';
import { UserExam } from 'src/entities/user-exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, User, UserExam])],
  controllers: [UserExamController],
  providers: [UserExamService],
})
export class UserExamModule {}
