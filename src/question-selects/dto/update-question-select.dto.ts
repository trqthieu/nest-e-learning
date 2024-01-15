import { PartialType } from '@nestjs/swagger';
import { CreateQuestionSelectDto } from './create-question-select.dto';

export class UpdateQuestionSelectDto extends PartialType(CreateQuestionSelectDto) {}
