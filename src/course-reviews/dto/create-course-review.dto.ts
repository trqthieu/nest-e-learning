import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseReviewDto {
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
  courseId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authorId: number;
}
