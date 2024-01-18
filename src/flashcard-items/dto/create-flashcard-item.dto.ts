import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashcardItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  word: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  wordType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  definition: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pronunciation: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  examples: string[];

  @ApiProperty()
  @IsInt()
  flashcardId: number;
}
