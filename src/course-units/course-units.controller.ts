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
import { CourseUnitsService } from './course-units.service';
import { CreateCourseUnitDto } from './dto/create-course-unit.dto';
import { UpdateCourseUnitDto } from './dto/update-course-unit.dto';
import { Public } from 'src/auth/guards/roles.decorator';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('course-units')
@ApiTags('course-units')
export class CourseUnitsController {
  constructor(private readonly courseUnitsService: CourseUnitsService) {}

  @Post()
  async create(@Body() createCourseUnitDto: CreateCourseUnitDto) {
    try {
      return await this.courseUnitsService.create(createCourseUnitDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.courseUnitsService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.courseUnitsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseUnitDto: UpdateCourseUnitDto,
  ) {
    try {
      return await this.courseUnitsService.update(+id, updateCourseUnitDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.courseUnitsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
