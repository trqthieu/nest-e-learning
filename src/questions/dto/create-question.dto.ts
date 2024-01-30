import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionSelectDto } from 'src/question-selects/dto/create-question-select.dto';
import { EAnswerType } from 'src/utils/enum/answer-type.enum';
import { EQuestionType } from 'src/utils/enum/question-type.enum';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  video?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  audio?: string;

  @ApiProperty({
    enum: EAnswerType,
  })
  @IsEnum(EAnswerType)
  answerType: EAnswerType;

  @ApiProperty({
    enum: EQuestionType,
  })
  @IsEnum(EQuestionType)
  questionType: EQuestionType;

  @ApiPropertyOptional({
    type: String,
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  attachments?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  exerciseId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  examId?: number;

  @ApiPropertyOptional({
    type: CreateQuestionSelectDto,
    isArray: true,
  })
  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionSelectDto)
  selections?: CreateQuestionSelectDto[];
}
