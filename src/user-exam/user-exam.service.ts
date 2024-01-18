import { Injectable } from '@nestjs/common';
import { CreateUserExamDto } from './dto/create-user-exam.dto';
import { UpdateUserExamDto } from './dto/update-user-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Exam } from 'src/entities/exam.entity';
import { UserExam } from 'src/entities/user-exam.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class UserExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserExam)
    private userExamRepo: Repository<UserExam>,
  ) {}
  async create(createUserExamDto: CreateUserExamDto) {
    const exam = await this.examRepo.findOneBy({
      id: createUserExamDto.examId,
    });
    const user = await this.userRepo.findOneBy({
      id: createUserExamDto.userId,
    });
    const userExam = await this.userExamRepo.create({
      ...createUserExamDto,
      exam: exam,
      user: user,
    });
    return await this.userExamRepo.save(userExam);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.userExamRepo.createQueryBuilder('user_exam');
    queryBuilder
      .leftJoinAndSelect('user_exam.exam', 'exam')
      .leftJoinAndSelect('user_exam.user', 'user')
      .orderBy('user_exam.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.userExamRepo.findOne({
      where: {
        id,
      },
      relations: {
        exam: true,
        user: true,
      },
    });
  }

  async update(id: number, updateUserExamDto: UpdateUserExamDto) {
    const exam = await this.examRepo.findOneBy({
      id: updateUserExamDto.examId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateUserExamDto.userId,
    });
    const userExam = await this.userExamRepo.create({
      id,
      ...updateUserExamDto,
      exam: exam,
      user: user,
    });
    return await this.userExamRepo.save(userExam);
  }

  async remove(id: number) {
    return await this.userExamRepo.softDelete({
      id: +id,
    });
  }
}
