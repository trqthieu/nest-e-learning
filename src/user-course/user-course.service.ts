import { Injectable } from '@nestjs/common';
import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { UpdateUserCourseDto } from './dto/update-user-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import { UserCourse } from 'src/entities/user-course.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

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
    const userCourse = await this.userCourseRepo.create({
      ...createUserCourseDto,
      course: course,
      user: user,
    });
    return await this.userCourseRepo.save(userCourse);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.userCourseRepo.createQueryBuilder('user_course');
    queryBuilder
      .leftJoinAndSelect('user_course.course', 'course')
      .leftJoinAndSelect('user_course.user', 'user')
      .orderBy('user_course.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
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
