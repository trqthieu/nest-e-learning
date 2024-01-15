import { ECourseStatus } from 'src/utils/enum/course-status.enum';
import { ELevel } from 'src/utils/enum/level.enum';
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
import { CourseGroup } from './course-group.entity';
import { CourseReview } from './course-review.entity';
import { CourseSection } from './course-section.entity';
import { UserCourse } from './user-course.entity';
import { User } from './user.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { array: true })
  description: string[];

  @Column('varchar', { array: true })
  target: string[];

  @Column('varchar')
  guideline: string;

  @Column('int')
  duration: number;

  @Column('varchar')
  banner: string;

  @Column({
    type: 'enum',
    enum: ELevel,
  })
  level: ELevel;

  @Column({
    type: 'enum',
    enum: ECourseStatus,
  })
  status: ECourseStatus;

  @ManyToOne(() => User, (user) => user.courses)
  teacher: User;

  @ManyToOne(() => CourseGroup, (courseGroup) => courseGroup.courses)
  courseGroup: CourseGroup;

  @OneToMany(() => CourseSection, (courseSection) => courseSection.course)
  courseSections: CourseSection[];

  @OneToMany(() => CourseReview, (courseReview) => courseReview.course)
  courseReviews: CourseReview[];

  @OneToMany(() => UserCourse, (userCourse) => userCourse.course)
  userCourses: UserCourse[];

  @Column({
    type: 'enum',
    enum: ESubjectCategory,
  })
  category: ESubjectCategory;

  @Column('int')
  price: number;

  @Column('int')
  discount: number;

  @Column('varchar')
  timeDiscountStart: Date;

  @Column('varchar')
  timeDiscountEnd: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
