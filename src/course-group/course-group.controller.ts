import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { CourseGroupService } from './course-group.service';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';

@Controller('course-group')
@ApiTags('course-group')
export class CourseGroupController {
  constructor(private readonly courseGroupService: CourseGroupService) {}

  @Post()
  async create(@Body() createCourseGroupDto: CreateCourseGroupDto) {
    try {
      return await this.courseGroupService.create(createCourseGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.courseGroupService.findAll(pageOptionsDto);
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
  async update(
    @Param('id') id: string,
    @Body() updateCourseGroupDto: UpdateCourseGroupDto,
  ) {
    try {
      return await this.courseGroupService.update(+id, updateCourseGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.courseGroupService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
