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
import { Course } from './course.entity';

@Entity()
export class CourseSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  description: string;

  @ManyToOne(() => Course, (course) => course.courseSections)
  course: Course;

  @OneToMany(() => CourseUnit, (courseUnit) => courseUnit.courseSection)
  courseUnits: CourseUnit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
