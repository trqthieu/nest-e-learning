import { Module } from '@nestjs/common';
import { FlashcardItemsService } from './flashcard-items.service';
import { FlashcardItemsController } from './flashcard-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from 'src/entities/flashcard.entity';
import { FlashcardItem } from 'src/entities/flashcard-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlashcardItem, Flashcard])],
  controllers: [FlashcardItemsController],
  providers: [FlashcardItemsService],
})
export class FlashcardItemsModule {}
