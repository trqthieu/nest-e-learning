import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class OrderCourseSectionDto {
  @ApiProperty()
  @IsInt()
  activeId: number;

  @ApiProperty()
  @IsInt()
  overId: number;
}
