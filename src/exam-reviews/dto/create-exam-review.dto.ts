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
  @IsString()
  @IsNotEmpty()
  examId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authorId: number;
}
