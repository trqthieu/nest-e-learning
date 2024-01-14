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
import { CourseSection } from './course-section.entity';
import { Exercise } from './exercise.entity';
import { Lesson } from './lesson.entity';
import { UserCourseUnit } from './user-courseunit.entity';

@Entity()
export class CourseUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('varchar')
  description: string;

  @Column('int')
  order: number;

  @ManyToOne(() => CourseSection, (courseSection) => courseSection.courseUnits)
  courseSection: CourseSection;

  @OneToMany(() => Lesson, (lesson) => lesson.courseUnit)
  lessons: Lesson[];

  @OneToMany(() => Exercise, (exercise) => exercise.courseUnit)
  exercises: Exercise[];

  @OneToMany(
    () => UserCourseUnit,
    (userCourseUnit) => userCourseUnit.courseUnit,
  )
  userCourseUnits: UserCourseUnit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
