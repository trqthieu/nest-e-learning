import { ETopic } from 'src/utils/enum/topic.enum';
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
import { FlashcardGroup } from './flashcard-group.entity';
import { FlashcardItem } from './flashcard-item.entity';

@Entity()
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column({
    type: 'enum',
    enum: ETopic,
  })
  topic: ETopic;

  @ManyToOne(
    () => FlashcardGroup,
    (flashcardGroup) => flashcardGroup.flashcards,
  )
  flashcardGroup: FlashcardGroup;

  @OneToMany(() => FlashcardItem, (flashcardItem) => flashcardItem.flashcard)
  flashcardItems: FlashcardItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
