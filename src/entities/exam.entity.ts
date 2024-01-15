import { ESubjectCategory } from 'src/utils/enum/subject-category.enum';
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
import { ExamReview } from './exam-review.entity';
import { Question } from './question.entity';
import { UserExam } from './user-exam.entity';
import { User } from './user.entity';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  description: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ESubjectCategory,
  })
  category: ESubjectCategory;

  @ManyToOne(() => User, (user) => user.exams)
  author: User;

  // @OneToMany(() => ExamUnit, (examUnit) => examUnit.exam)
  // examUnits: ExamUnit[];

  @OneToMany(() => Question, (question) => question.exam)
  questions: Question[];

  @OneToMany(() => ExamReview, (examReview) => examReview.exam)
  examReviews: ExamReview[];

  @OneToMany(() => UserExam, (userExam) => userExam.exam)
  userExams: UserExam[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
