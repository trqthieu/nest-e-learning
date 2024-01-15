import { PartialType } from '@nestjs/swagger';
import { CreateCourseUnitDto } from './create-course-unit.dto';

export class UpdateCourseUnitDto extends PartialType(CreateCourseUnitDto) {}
