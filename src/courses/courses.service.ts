import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    const teacher = await this.userRepo.findOneBy({
      id: createCourseDto.teacherId,
    });
    const course = await this.courseRepo.create({
      ...createCourseDto,
      teacher: teacher,
    });
    return await this.courseRepo.save(course);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.courseRepo.createQueryBuilder('course');
    queryBuilder
      .leftJoinAndSelect('course.teacher', 'user')
      .orderBy('course.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.courseRepo.findOne({
      where: {
        id,
      },
      relations: {
        teacher: true,
      },
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const teacher = await this.userRepo.findOneBy({
      id: updateCourseDto.teacherId,
    });
    const course = await this.courseRepo.create({
      id: id,
      ...updateCourseDto,
      teacher: teacher,
    });
    return await this.courseRepo.save(course);
  }

  async remove(id: number) {
    return await this.courseRepo.softDelete({
      id: +id,
    });
  }
}
