import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exam } from './exam.entity';
import { User } from './user.entity';

@Entity()
export class ExamReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  content: string;

  @Column('int')
  rate: number;

  @ManyToOne(() => Exam, (Exam) => Exam.examReviews)
  exam: Exam;

  @ManyToOne(() => User, (user) => user.examReviews)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
