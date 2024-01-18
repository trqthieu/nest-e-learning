import { Injectable } from '@nestjs/common';
import { CreateUserLessonDto } from './dto/create-user-lesson.dto';
import { UpdateUserLessonDto } from './dto/update-user-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/entities/lesson.entity';
import { UserLesson } from 'src/entities/user-lesson.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class UserLessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserLesson)
    private userLessonRepo: Repository<UserLesson>,
  ) {}
  async create(createUserLessonDto: CreateUserLessonDto) {
    const lesson = await this.lessonRepo.findOneBy({
      id: createUserLessonDto.lessonId,
    });
    const user = await this.userRepo.findOneBy({
      id: createUserLessonDto.userId,
    });
    const userLesson = await this.userLessonRepo.create({
      ...createUserLessonDto,
      lesson: lesson,
      user: user,
    });
    return await this.userLessonRepo.save(userLesson);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.userLessonRepo.createQueryBuilder('user_lesson');
    queryBuilder
      .leftJoinAndSelect('user_lesson.lesson', 'lesson')
      .leftJoinAndSelect('user_lesson.user', 'user')
      .orderBy('user_lesson.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.userLessonRepo.findOne({
      where: {
        id,
      },
      relations: {
        lesson: true,
        user: true,
      },
    });
  }

  async update(id: number, updateUserLessonDto: UpdateUserLessonDto) {
    const lesson = await this.lessonRepo.findOneBy({
      id: updateUserLessonDto.lessonId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateUserLessonDto.userId,
    });
    const userLesson = await this.userLessonRepo.create({
      id,
      ...updateUserLessonDto,
      lesson: lesson,
      user: user,
    });
    return await this.userLessonRepo.save(userLesson);
  }

  async remove(id: number) {
    return await this.userLessonRepo.softDelete({
      id: +id,
    });
  }
}
