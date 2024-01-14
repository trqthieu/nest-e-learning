import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Flashcard } from './flashcard.entity';

@Entity()
export class FlashcardItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  word: string;

  @Column('varchar')
  wordType: string;

  @Column('varchar')
  definition: string;

  @Column('varchar')
  pronunciation: string;

  @Column('varchar', { array: true })
  examples: string[];

  @ManyToOne(() => Flashcard, (flashcard) => flashcard.flashcardItems)
  flashcard: Flashcard;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
