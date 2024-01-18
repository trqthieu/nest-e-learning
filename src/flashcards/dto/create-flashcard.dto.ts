import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ETopic } from 'src/utils/enum/topic.enum';

export class CreateFlashcardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: ETopic,
  })
  @IsEnum(ETopic)
  topic: ETopic;

  @ApiProperty()
  @IsInt()
  flashcardGroupId: number;
}
