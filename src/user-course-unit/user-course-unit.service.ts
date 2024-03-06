import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { UserCourseUnit } from 'src/entities/user-courseunit.entity';
import { User } from 'src/entities/user.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { Repository } from 'typeorm';
import { CreateUserCourseUnitDto } from './dto/create-user-course-unit.dto';
import { GetUserCourseUnitDto } from './dto/get-user-course-unit.dto';
import { UpdateUserCourseUnitDto } from './dto/update-user-course-unit.dto';

@Injectable()
export class UserCourseUnitService {
  constructor(
    @InjectRepository(CourseUnit)
    private courseUnitRepo: Repository<CourseUnit>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserCourseUnit)
    private userCourseUnitRepo: Repository<UserCourseUnit>,
  ) {}
  async create(createUserCourseUnitDto: CreateUserCourseUnitDto) {
    const courseUnit = await this.courseUnitRepo.findOneBy({
      id: createUserCourseUnitDto.courseUnitId,
    });
    const user = await this.userRepo.findOneBy({
      id: createUserCourseUnitDto.userId,
    });
    const existedUserCourseUnit = await this.userCourseUnitRepo.findOne({
      where: {
        courseUnit: courseUnit,
        user: user,
      },
    });
    if (existedUserCourseUnit) {
      return existedUserCourseUnit;
    }
    const userCourseUnit = await this.userCourseUnitRepo.create({
      ...createUserCourseUnitDto,
      courseUnit: courseUnit,
      user: user,
    });
    return await this.userCourseUnitRepo.save(userCourseUnit);
  }

  async findAll(getUserCourseUnitDto: GetUserCourseUnitDto) {
    const queryBuilder =
      this.userCourseUnitRepo.createQueryBuilder('user_course_unit');
    const { courseUnitId, userId } = getUserCourseUnitDto;
    const expression = courseUnitId
      ? {
          courseUnitId: courseUnitId,
        }
      : userId
      ? {
          userId: userId,
        }
      : {};
    const where = courseUnitId
      ? 'course_unit.id = :courseUnitId'
      : userId
      ? 'user.id = :userId'
      : {};
    queryBuilder
      .where(where, expression)
      .leftJoinAndSelect('user_course_unit.courseUnit', 'courseUnit')
      .leftJoinAndSelect('user_course_unit.user', 'user')
      .orderBy('user_course_unit.createdAt', getUserCourseUnitDto.order)
      .skip(getUserCourseUnitDto.skip)
      .take(getUserCourseUnitDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: getUserCourseUnitDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.userCourseUnitRepo.findOne({
      where: {
        id,
      },
      relations: {
        courseUnit: true,
        user: true,
      },
    });
  }

  async update(id: number, updateUserCourseUnitDto: UpdateUserCourseUnitDto) {
    const courseUnit = await this.courseUnitRepo.findOneBy({
      id: updateUserCourseUnitDto.courseUnitId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateUserCourseUnitDto.userId,
    });
    const userCourse = await this.userCourseUnitRepo.create({
      id,
      ...updateUserCourseUnitDto,
      courseUnit: courseUnit,
      user: user,
    });
    return await this.userCourseUnitRepo.save(userCourse);
  }

  async remove(id: number) {
    return await this.userCourseUnitRepo.softDelete({
      id: +id,
    });
  }
}
