import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsInt()
  rate: number;

  @ApiProperty()
  @IsInt()
  examId: number;

  @ApiProperty()
  @IsInt()
  authorId: number;
}
