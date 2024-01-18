import { Injectable } from '@nestjs/common';
import { CreateUserExerciseDto } from './dto/create-user-exercise.dto';
import { UpdateUserExerciseDto } from './dto/update-user-exercise.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Exercise } from 'src/entities/exercise.entity';
import { UserExercise } from 'src/entities/user-exercise.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class UserExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserExercise)
    private userExerciseRepo: Repository<UserExercise>,
  ) {}
  async create(createUserExerciseDto: CreateUserExerciseDto) {
    const exercise = await this.exerciseRepo.findOneBy({
      id: createUserExerciseDto.exerciseId,
    });
    const user = await this.userRepo.findOneBy({
      id: createUserExerciseDto.userId,
    });
    const userExercise = await this.userExerciseRepo.create({
      ...createUserExerciseDto,
      exercise: exercise,
      user: user,
    });
    return await this.userExerciseRepo.save(userExercise);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.userExerciseRepo.createQueryBuilder('user_exercise');
    queryBuilder
      .leftJoinAndSelect('user_exercise.exercise', 'exercise')
      .leftJoinAndSelect('user_exercise.user', 'user')
      .orderBy('user_exercise.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.userExerciseRepo.findOne({
      where: {
        id,
      },
      relations: {
        exercise: true,
        user: true,
      },
    });
  }

  async update(id: number, updateUserExerciseDto: UpdateUserExerciseDto) {
    const exercise = await this.exerciseRepo.findOneBy({
      id: updateUserExerciseDto.exerciseId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateUserExerciseDto.userId,
    });
    const userExercise = await this.userExerciseRepo.create({
      id,
      ...updateUserExerciseDto,
      exercise: exercise,
      user: user,
    });
    return await this.userExerciseRepo.save(userExercise);
  }

  async remove(id: number) {
    return await this.userExerciseRepo.softDelete({
      id: +id,
    });
  }
}
