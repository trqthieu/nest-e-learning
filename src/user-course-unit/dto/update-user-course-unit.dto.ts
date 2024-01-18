import { PartialType } from '@nestjs/swagger';
import { CreateUserCourseUnitDto } from './create-user-course-unit.dto';

export class UpdateUserCourseUnitDto extends PartialType(
  CreateUserCourseUnitDto,
) {}
