import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserCourseUnitDto } from './create-user-course-unit.dto';
import { IsBoolean } from 'class-validator';

export class UpdateUserCourseUnitDto extends PartialType(
  CreateUserCourseUnitDto,
) {
  @ApiPropertyOptional()
  @IsBoolean()
  is_completed: boolean;
}
