import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { Exercise } from 'src/entities/exercise.entity';
import { QuestionSelect } from 'src/entities/question-select.entity';
import { Exam } from 'src/entities/exam.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionSelect, Exercise, Exam]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
