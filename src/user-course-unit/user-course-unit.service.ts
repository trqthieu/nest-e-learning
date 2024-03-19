import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUnit } from 'src/entities/course-unit.entity';
import { UserCourseUnit } from 'src/entities/user-courseunit.entity';
import { User } from 'src/entities/user.entity';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { In, Repository } from 'typeorm';
import { CreateUserCourseUnitDto } from './dto/create-user-course-unit.dto';
import { GetUserCourseUnitDto } from './dto/get-user-course-unit.dto';
import { UpdateUserCourseUnitDto } from './dto/update-user-course-unit.dto';
import { Course } from 'src/entities/course.entity';
import { UserCourse } from 'src/entities/user-course.entity';
import { GetStatusUnitDto } from './dto/get-status-unit.dto';

@Injectable()
export class UserCourseUnitService {
  constructor(
    @InjectRepository(CourseUnit)
    private courseUnitRepo: Repository<CourseUnit>,
    @InjectRepository(UserCourse)
    private userCourseRepo: Repository<UserCourse>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
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
        user: {
          id: createUserCourseUnitDto.userId,
        },
        courseUnit: {
          id: createUserCourseUnitDto.courseUnitId,
        },
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
    console.log('where, expression', where, expression);

    queryBuilder
      .where(where, expression)
      .leftJoinAndSelect('user_course_unit.courseUnit', 'course_unit')
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

  async getStatusUnit(getStatusUnit: GetStatusUnitDto) {
    const userUnit = await this.userCourseUnitRepo
      .createQueryBuilder('user_course_unit')
      .innerJoin('user_course_unit.user', 'user')
      .innerJoin('user_course_unit.courseUnit', 'courseUnit')
      .where('user.id = :userId', { userId: getStatusUnit.userId })
      .andWhere('courseUnit.id IN (:...unitIds)', {
        unitIds: getStatusUnit.unitIds,
      })
      .getMany();
    return userUnit;
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
    const courseUnit = await this.courseUnitRepo.findOne({
      where: {
        id: updateUserCourseUnitDto.courseUnitId,
      },
      relations: {
        courseSection: {
          course: true,
        },
      },
      select: {
        courseSection: {
          id: true,
          course: {
            id: true,
          },
        },
      },
    });
    const user = await this.userRepo.findOneBy({
      id: updateUserCourseUnitDto.userId,
    });
    const userCourseUnit = await this.userCourseUnitRepo.create({
      id,
      ...updateUserCourseUnitDto,
      courseUnit: courseUnit,
      user: user,
    });
    const result = await this.userCourseUnitRepo.save(userCourseUnit);
    const courseId = courseUnit.courseSection.course.id;
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: {
        courseSections: {
          courseUnits: true,
        },
      },
    });
    let totalUnit = 0;
    course.courseSections.forEach((section) => {
      totalUnit += section.courseUnits.length;
    });
    console.log(user, course);

    const totalUnitCompleted = await this.userCourseUnitRepo.count({
      where: {
        is_completed: true,
        user: {
          id: user.id,
        },
        courseUnit: {
          courseSection: {
            course: {
              id: courseId,
            },
          },
        },
      },
    });
    const process = Math.floor((totalUnitCompleted * 100) / totalUnit);
    console.log('process', process);
    console.log(course.id);

    const userCourse = await this.userCourseRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        course: {
          id: course.id,
        },
      },
    });
    const userCourseUpdate = await this.userCourseRepo.create({
      id: userCourse.id,
      process: process,
    });
    await this.userCourseRepo.save(userCourseUpdate);
    return result;
  }

  async remove(id: number) {
    return await this.userCourseUnitRepo.softDelete({
      id: +id,
    });
  }
}
