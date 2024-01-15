import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
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

  @ManyToOne(() => User, (User) => User.answerAnalyzes)
  author: User;

  @ManyToOne(() => Question, (question) => question.answerAnalyzes)
  question: Question;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
