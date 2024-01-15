import { Injectable } from '@nestjs/common';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseGroup } from 'src/entities/course-group.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CourseGroupService {
  constructor(
    @InjectRepository(CourseGroup)
    private courseGroupRepo: Repository<CourseGroup>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(createCourseGroupDto: CreateCourseGroupDto) {
    const author = await this.userRepo.findOneBy({
      id: createCourseGroupDto.authorId,
    });
    const courseGroup = await this.courseGroupRepo.create({
      ...createCourseGroupDto,
      author: author,
    });
    return await this.courseGroupRepo.save(courseGroup);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.courseGroupRepo.createQueryBuilder('course_group');
    queryBuilder
      .leftJoinAndSelect('course_group.author', 'user')
      .orderBy('course_group.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.courseGroupRepo.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });
  }

  async update(id: number, updateCourseGroupDto: UpdateCourseGroupDto) {
    const author = await this.userRepo.findOneBy({
      id: updateCourseGroupDto.authorId,
    });
    const courseGroup = await this.courseGroupRepo.create({
      id: id,
      ...updateCourseGroupDto,
      author: author,
    });
    return await this.courseGroupRepo.save(courseGroup);
  }

  async remove(id: number) {
    return await this.courseGroupRepo.softDelete({
      id: +id,
    });
  }
}
