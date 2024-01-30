import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { UserAnswer } from './user-answer.entity';

@Entity()
export class QuestionSelect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  key: string;

  @Column('int')
  order: number;

  @Column('varchar', { nullable: true })
  video?: string;

  @Column('varchar', { nullable: true })
  image?: string;

  @Column('varchar', { nullable: true })
  audio?: string;

  @Column('boolean')
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.questionSelects)
  question: Question;

  @ManyToMany(() => UserAnswer, (userAnswer) => userAnswer.answers)
  userAnswers: UserAnswer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
