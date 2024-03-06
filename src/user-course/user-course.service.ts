import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { UserCourse } from 'src/entities/user-course.entity';
import { User } from 'src/entities/user.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Repository } from 'typeorm';
import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { GetUserCourseDto } from './dto/get-user-course.dto';
import { UpdateUserCourseDto } from './dto/update-user-course.dto';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserCourse)
    private userCourseRepo: Repository<UserCourse>,
  ) {}
  async create(createUserCourseDto: CreateUserCourseDto) {
    const course = await this.courseRepo.findOneBy({
      id: createUserCourseDto.courseId,
    });
    const user = await this.userRepo.findOneBy({
      id: createUserCourseDto.userId,
    });
    const existedUserCourse = await this.userCourseRepo.findOne({
      where: {
        course: course,
        user: user,
      },
    });
    if (existedUserCourse) {
      return existedUserCourse;
    }
    const userCourse = await this.userCourseRepo.create({
      ...createUserCourseDto,
      course: course,
      user: user,
    });
    return await this.userCourseRepo.save(userCourse);
  }

  async findAll(getUserCourseDto: GetUserCourseDto) {
    const queryBuilder = this.userCourseRepo.createQueryBuilder('user_course');
    const { courseId, userId } = getUserCourseDto;
    const expression = courseId
      ? {
          courseId: courseId,
        }
      : userId
      ? {
          userId: userId,
        }
      : {};
    const where = courseId
      ? 'course.id = :courseId'
      : userId
      ? 'user.id = :userId'
      : {};
    queryBuilder
      .where(where, expression)
      .leftJoinAndSelect('user_course.course', 'course')
      .leftJoinAndSelect('user_course.user', 'user')
      .orderBy('user_course.createdAt', getUserCourseDto.order)
      .skip(getUserCourseDto.skip)
      .take(getUserCourseDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getUserCourseDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.userCourseRepo.findOne({
      where: {
        id,
      },
      relations: {
        course: true,
        user: true,
      },
    });
  }

  async update(id: number, updateUserCourseDto: UpdateUserCourseDto) {
    const course = await this.courseRepo.findOneBy({
      id: updateUserCourseDto.courseId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateUserCourseDto.userId,
    });
    const userCourse = await this.userCourseRepo.create({
      id,
      ...updateUserCourseDto,
      course: course,
      user: user,
    });
    return await this.userCourseRepo.save(userCourse);
  }

  async remove(id: number) {
    return await this.userCourseRepo.softDelete({
      id: +id,
    });
  }
}
