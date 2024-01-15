import { Module } from '@nestjs/common';
import { QuestionSelectsService } from './question-selects.service';
import { QuestionSelectsController } from './question-selects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { QuestionSelect } from 'src/entities/question-select.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionSelect])],
  controllers: [QuestionSelectsController],
  providers: [QuestionSelectsService],
})
export class QuestionSelectsModule {}
