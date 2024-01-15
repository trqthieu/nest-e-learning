import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EAnswerType } from 'src/utils/enum/answer-type.enum';
import { EQuestionType } from 'src/utils/enum/question-type.enum';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  video: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  audio: string;

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

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  attachments: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  exerciseId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  examId?: number;
}
