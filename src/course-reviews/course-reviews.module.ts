import { Module } from '@nestjs/common';
import { CourseReviewsService } from './course-reviews.service';
import { CourseReviewsController } from './course-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { User } from 'src/entities/user.entity';
import { CourseReview } from 'src/entities/course-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, CourseReview])],
  controllers: [CourseReviewsController],
  providers: [CourseReviewsService],
})
export class CourseReviewsModule {}
