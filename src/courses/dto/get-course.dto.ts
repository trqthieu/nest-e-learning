import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { ELevel } from 'src/utils/enum/level.enum';
import { ESubjectCategory } from 'src/utils/enum/subject-category.enum';

export class GetCourseDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ enum: ELevel })
  @IsOptional()
  @IsEnum(ELevel)
  level: ELevel;

  @ApiPropertyOptional({ enum: ESubjectCategory })
  @IsOptional()
  @IsEnum(ESubjectCategory)
  category: ESubjectCategory;
}
