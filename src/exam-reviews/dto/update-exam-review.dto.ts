import { PartialType } from '@nestjs/swagger';
import { CreateExamReviewDto } from './create-exam-review.dto';

export class UpdateExamReviewDto extends PartialType(CreateExamReviewDto) {}
