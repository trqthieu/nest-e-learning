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
import { CourseSectionsService } from './course-sections.service';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { GetCourseSectionDto } from './dto/get-course-section.dto';
import { OrderCourseSectionDto } from './dto/order-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';

@Controller('course-sections')
@ApiTags('course-sections')
export class CourseSectionsController {
  constructor(private readonly courseSectionsService: CourseSectionsService) {}

  @Post()
  async create(@Body() createCourseSectionDto: CreateCourseSectionDto) {
    try {
      return await this.courseSectionsService.create(createCourseSectionDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('changeOrder')
  async changeOrder(@Body() orderCourseSectionDto: OrderCourseSectionDto) {
    try {
      return await this.courseSectionsService.changeOrder(
        orderCourseSectionDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() getCourseSectionDto: GetCourseSectionDto) {
    try {
      return await this.courseSectionsService.findAll(getCourseSectionDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.courseSectionsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseSectionDto: UpdateCourseSectionDto,
  ) {
    try {
      return await this.courseSectionsService.update(
        +id,
        updateCourseSectionDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.courseSectionsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
