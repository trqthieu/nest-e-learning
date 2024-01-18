import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateUserExamDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  examId: number;
}
