import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ESubjectCategory } from 'src/utils/enum/subject-category.enum';

export class CreateExamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    enum: ESubjectCategory,
  })
  @IsEnum(ESubjectCategory)
  category: ESubjectCategory;

  @ApiProperty()
  @IsInt()
  authorId: number;
}
