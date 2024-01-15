import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity()
export class CourseReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  content: string;

  @Column('int')
  rate: number;

  @ManyToOne(() => Course, (course) => course.courseReviews)
  course: Course;

  @ManyToOne(() => User, (user) => user.courseReviews)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
