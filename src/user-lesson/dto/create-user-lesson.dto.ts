import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateUserLessonDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  lessonId: number;
}
