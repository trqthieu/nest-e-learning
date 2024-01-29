import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

export class GetCourseUnitDto extends PageOptionsDto {
  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  courseSectionId: number;
}
