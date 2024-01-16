import { Module } from '@nestjs/common';
import { ExamReviewsService } from './exam-reviews.service';
import { ExamReviewsController } from './exam-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { User } from 'src/entities/user.entity';
import { ExamReview } from 'src/entities/exam-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, User, ExamReview])],
  controllers: [ExamReviewsController],
  providers: [ExamReviewsService],
})
export class ExamReviewsModule {}
