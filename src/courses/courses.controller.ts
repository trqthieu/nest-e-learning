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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Public } from 'src/auth/guards/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@Controller('courses')
@ApiTags('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      return await this.coursesService.create(createCourseDto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.coursesService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.coursesService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      return this.coursesService.update(+id, updateCourseDto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.coursesService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
