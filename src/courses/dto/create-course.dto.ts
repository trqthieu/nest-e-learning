import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { ECourseStatus } from 'src/utils/enum/course-status.enum';
import { ELevel } from 'src/utils/enum/level.enum';
import { ESubjectCategory } from 'src/utils/enum/subject-category.enum';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  description: string[];

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  target: string[];

  @ApiProperty()
  @IsNotEmpty()
  guideline: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  duration: number;

  @ApiProperty()
  @IsNotEmpty()
  banner: string;

  @ApiProperty({
    enum: ELevel,
  })
  @IsEnum(ELevel)
  level: ELevel;

  @ApiProperty({
    enum: ECourseStatus,
  })
  @IsEnum(ECourseStatus)
  status: ECourseStatus;

  @ApiProperty()
  @IsInt()
  teacherId: number;

  @ApiProperty()
  @IsInt()
  courseGroupId: number;

  @ApiProperty({
    enum: ESubjectCategory,
  })
  @IsEnum(ESubjectCategory)
  category: ESubjectCategory;

  @ApiProperty()
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  discount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  timeDiscountStart: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  timeDiscountEnd: Date;
}
