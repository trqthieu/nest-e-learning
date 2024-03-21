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
import { Exam } from './exam.entity';
import { UserAnswer } from './user-answer.entity';
import { User } from './user.entity';

@Entity()
export class UserExam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  score: number;

  @ManyToOne(() => User, (user) => user.userExams)
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.userExams)
  exam: Exam;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.userExam)
  userAnswers: UserAnswer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
