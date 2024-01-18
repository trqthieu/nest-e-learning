import { PartialType } from '@nestjs/swagger';
import { CreateFlashcardGroupDto } from './create-flashcard-group.dto';

export class UpdateFlashcardGroupDto extends PartialType(
  CreateFlashcardGroupDto,
) {}
