import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CourseGroupService } from './course-group.service';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { Public } from 'src/auth/guards/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('course-group')
@ApiTags('course-group')
export class CourseGroupController {
  constructor(private readonly courseGroupService: CourseGroupService) {}

  @Post()
  create(@Body() createCourseGroupDto: CreateCourseGroupDto) {
    try {
      return this.courseGroupService.create(createCourseGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return this.courseGroupService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.courseGroupService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseGroupDto: UpdateCourseGroupDto,
  ) {
    try {
      return this.courseGroupService.update(+id, updateCourseGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.courseGroupService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
