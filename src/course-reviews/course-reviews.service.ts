import { Injectable } from '@nestjs/common';
import { CreateCourseReviewDto } from './dto/create-course-review.dto';
import { UpdateCourseReviewDto } from './dto/update-course-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseReview } from 'src/entities/course-review.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class CourseReviewsService {
  constructor(
    @InjectRepository(CourseReview)
    private courseReviewRepo: Repository<CourseReview>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createCourseReviewDto: CreateCourseReviewDto) {
    const course = await this.courseRepo.findOneBy({
      id: createCourseReviewDto.courseId,
    });
    const user = await this.userRepo.findOneBy({
      id: createCourseReviewDto.authorId,
    });
    const courseReview = await this.courseReviewRepo.create({
      ...createCourseReviewDto,
      course: course,
      author: user,
    });
    return await this.courseReviewRepo.save(courseReview);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.courseReviewRepo.createQueryBuilder('course_review');
    queryBuilder
      .leftJoinAndSelect('course_review.course', 'course')
      .leftJoinAndSelect('course_review.author', 'user')
      .orderBy('course_review.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.courseReviewRepo.findOne({
      where: {
        id,
      },
      relations: {
        course: true,
        author: true,
      },
    });
  }

  async update(id: number, updateCourseReviewDto: UpdateCourseReviewDto) {
    const course = await this.courseRepo.findOneBy({
      id: updateCourseReviewDto.courseId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateCourseReviewDto.authorId,
    });
    const lesson = await this.courseReviewRepo.create({
      id: id,
      ...updateCourseReviewDto,
      course: course,
      author: user,
    });
    return await this.courseReviewRepo.save(lesson);
  }

  async remove(id: number) {
    return await this.courseReviewRepo.softDelete({
      id: +id,
    });
  }
}
