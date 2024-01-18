import { Module } from '@nestjs/common';
import { FlashcardGroupsService } from './flashcard-groups.service';
import { FlashcardGroupsController } from './flashcard-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FlashcardGroup } from 'src/entities/flashcard-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FlashcardGroup, User])],
  controllers: [FlashcardGroupsController],
  providers: [FlashcardGroupsService],
})
export class FlashcardGroupsModule {}
