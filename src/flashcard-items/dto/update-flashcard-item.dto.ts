import { PartialType } from '@nestjs/swagger';
import { CreateFlashcardItemDto } from './create-flashcard-item.dto';

export class UpdateFlashcardItemDto extends PartialType(
  CreateFlashcardItemDto,
) {}
