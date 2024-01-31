import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { EQuestionType } from 'src/utils/enum/question-type.enum';

export class OrderQuestionDto {
  @ApiProperty()
  @IsInt()
  activeId: number;

  @ApiProperty()
  @IsInt()
  overId: number;

  @ApiProperty({
    enum: EQuestionType,
  })
  @IsEnum(EQuestionType)
  type: EQuestionType;
}
