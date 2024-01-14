import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAnswer } from './user-answer.entity';
import { User } from './user.entity';

@Entity()
export class AnswerAnalyze {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('varchar')
  image: string;

  @Column('varchar')
  video: string;

  @Column('varchar')
  audio: string;

  @ManyToOne(() => UserAnswer, (userAnswer) => userAnswer.answerAnalyzes)
  userAnswer: UserAnswer;

  @ManyToOne(() => User, (User) => User.answerAnalyzes)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
