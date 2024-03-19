import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetStatusUnitDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt({ each: true })
  unitIds: number[];
}
