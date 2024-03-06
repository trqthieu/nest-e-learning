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
import { CourseReviewsService } from './course-reviews.service';
import { CreateCourseReviewDto } from './dto/create-course-review.dto';
import { UpdateCourseReviewDto } from './dto/update-course-review.dto';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('course-reviews')
@ApiTags('course-reviews')
export class CourseReviewsController {
  constructor(private readonly courseReviewsService: CourseReviewsService) {}

  @Post()
  async create(@Body() createCourseReviewDto: CreateCourseReviewDto) {
    try {
      return await this.courseReviewsService.create(createCourseReviewDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.courseReviewsService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.courseReviewsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseReviewDto: UpdateCourseReviewDto,
  ) {
    try {
      return await this.courseReviewsService.update(+id, updateCourseReviewDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.courseReviewsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
