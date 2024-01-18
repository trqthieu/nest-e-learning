import { Module } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { UserExerciseController } from './user-exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from 'src/entities/exercise.entity';
import { User } from 'src/entities/user.entity';
import { UserExercise } from 'src/entities/user-exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, User, UserExercise])],
  controllers: [UserExerciseController],
  providers: [UserExerciseService],
})
export class UserExerciseModule {}
