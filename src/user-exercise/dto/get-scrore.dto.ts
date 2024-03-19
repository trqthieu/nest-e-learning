import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetScoreEx {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt({ each: true })
  exerciseIds: number[];
}
