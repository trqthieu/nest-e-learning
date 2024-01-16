import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerAnalyze } from 'src/entities/answer-analyze.entity';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { AnswerAnalyzesController } from './answer-analyzes.controller';
import { AnswerAnalyzesService } from './answer-analyzes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, AnswerAnalyze])],
  controllers: [AnswerAnalyzesController],
  providers: [AnswerAnalyzesService],
})
export class AnswerAnalyzesModule {}
