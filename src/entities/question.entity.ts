import { EAnswerType } from 'src/utils/enum/answer-type.enum';
import { EQuestionType } from 'src/utils/enum/question-type.enum';
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
import { AnswerAnalyze } from './answer-analyze.entity';
import { Exam } from './exam.entity';
import { Exercise } from './exercise.entity';
import { QuestionSelect } from './question-select.entity';
import { UserAnswer } from './user-answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int')
  order: number;

  @Column('text')
  content: string;

  @Column('varchar')
  video: string;

  @Column('varchar')
  image: string;

  @Column('varchar')
  audio: string;

  @Column({
    type: 'enum',
    enum: EAnswerType,
  })
  answerType: EAnswerType;

  @Column({
    type: 'enum',
    enum: EQuestionType,
  })
  questionType: EQuestionType;

  @Column('varchar', { array: true })
  attachments: string[];

  @ManyToOne(() => Exercise, (exercise) => exercise.questions)
  exercise: Exercise;

  // @ManyToOne(() => ExamUnit, (examUnit) => examUnit.questions)
  // examUnit: ExamUnit;

  @ManyToOne(() => Exam, (exam) => exam.questions)
  exam: Exam;

  @OneToMany(() => QuestionSelect, (questionSelect) => questionSelect.question)
  questionSelects: QuestionSelect[];

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question)
  userAnswers: UserAnswer[];

  @OneToMany(() => AnswerAnalyze, (answerAnalyze) => answerAnalyze.question)
  answerAnalyzes: AnswerAnalyze[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
