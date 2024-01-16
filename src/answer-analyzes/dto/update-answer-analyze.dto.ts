import { PartialType } from '@nestjs/swagger';
import { CreateAnswerAnalyzeDto } from './create-answer-analyze.dto';

export class UpdateAnswerAnalyzeDto extends PartialType(
  CreateAnswerAnalyzeDto,
) {}
