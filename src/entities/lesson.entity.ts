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
import { CourseUnit } from './course-unit.entity';
import { UserLesson } from './user-lesson.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  description: string;

  @Column('int')
  order: number;

  @Column('text')
  content: string;

  @Column('varchar', { nullable: true })
  video: string;

  @Column('varchar', { nullable: true })
  banner: string;

  @Column('varchar', { array: true, nullable: true })
  attachments: string[];

  @ManyToOne(() => CourseUnit, (courseUnit) => courseUnit.lessons)
  courseUnit: CourseUnit;

  @OneToMany(() => UserLesson, (userLesson) => userLesson.lesson)
  userLessons: UserLesson[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
