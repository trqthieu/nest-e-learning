import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerAnalyze } from './answer-analyze.entity';
import { QuestionSelect } from './question-select.entity';
import { Question } from './question.entity';
import { UserExam } from './user-exam.entity';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { array: true })
  keys: string[];

  @Column('varchar')
  image: string;

  @Column('varchar')
  video: string;

  @Column('varchar')
  audio: string;

  @Column('boolean')
  isCorrect: boolean;

  @Column('int')
  mark: number;

  @ManyToMany(
    () => QuestionSelect,
    (questionSelect) => questionSelect.userAnswers,
  )
  @JoinTable()
  answers: QuestionSelect[];

  @ManyToOne(() => Question, (question) => question.userAnswers)
  question: Question;

  @ManyToOne(() => UserExam, (userExam) => userExam.userAnswers)
  userExam: UserExam;

  @OneToMany(() => AnswerAnalyze, (answerAnalyze) => answerAnalyze.userAnswer)
  answerAnalyzes: AnswerAnalyze[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
