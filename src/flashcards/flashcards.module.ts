import { Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardGroup } from 'src/entities/flashcard-group.entity';
import { Flashcard } from 'src/entities/flashcard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlashcardGroup, Flashcard])],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}
