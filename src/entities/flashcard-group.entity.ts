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
import { Flashcard } from './flashcard.entity';
import { User } from './user.entity';

@Entity()
export class FlashcardGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('boolean')
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.flashcardGroups)
  author: User;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.flashcardGroup)
  flashcards: Flashcard[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
