import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';
import { User } from './user.entity';

@Entity()
export class UserExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userExercises)
  user: User;

  @ManyToOne(() => Exercise, (exercise) => exercise.userExercises)
  exercise: Exercise;

  @Column({ type: 'int' })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
