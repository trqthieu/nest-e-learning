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
import { Course } from './course.entity';
import { User } from './user.entity';
import { Exam } from './exam.entity';
import { Article } from './article.entity';
import { CourseUnit } from './course-unit.entity';
import { Question } from './question.entity';
import { UserExam } from './user-exam.entity';
import { QuestionSelect } from './question-select.entity';
import { UserAnswer } from './user-answer.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  type: string;

  @Column('varchar')
  content: string;

  @Column('varchar')
  title: string;

  @ManyToOne(() => User, (User) => User.notificationsFrom)
  from: User;

  @ManyToOne(() => User, (User) => User.notificationsTo)
  to: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
