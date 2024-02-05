import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseUnit } from './course-unit.entity';
import { Question } from './question.entity';
import { UserExercise } from './user-exercise.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  description: string;

  @Column('int')
  order: number;

  @Column('text')
  content: string;

  @Column('varchar', { nullable: true })
  video?: string;

  @Column('varchar', { nullable: true })
  banner?: string;

  @Column('varchar', { array: true, nullable: true })
  attachments?: string[];

  @ManyToOne(() => CourseUnit, (courseUnit) => courseUnit.exercises)
  courseUnit: CourseUnit;

  @OneToMany(() => Question, (question) => question.exercise)
  questions: Question[];

  @OneToMany(() => UserExercise, (userExercise) => userExercise.exercise)
  userExercises: UserExercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
