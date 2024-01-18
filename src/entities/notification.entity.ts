import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

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
