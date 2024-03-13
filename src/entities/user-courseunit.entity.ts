import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseUnit } from './course-unit.entity';
import { User } from './user.entity';

@Entity()
export class UserCourseUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  is_completed: boolean;

  @ManyToOne(() => User, (user) => user.userCourseUnits)
  user: User;

  @ManyToOne(() => CourseUnit, (courseUnit) => courseUnit.userCourseUnits)
  courseUnit: CourseUnit;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
