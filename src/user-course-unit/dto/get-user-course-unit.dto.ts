import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

export class GetUserCourseUnitDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  courseUnitId: number;
}
