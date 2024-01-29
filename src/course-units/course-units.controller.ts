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
import { CourseUnitsService } from './course-units.service';
import { CreateCourseUnitDto } from './dto/create-course-unit.dto';
import { GetCourseUnitDto } from './dto/get-course-unit.dto';
import { UpdateCourseUnitDto } from './dto/update-course-unit.dto';
import { OrderCourseUnitDto } from './dto/order-course-unit.dto';

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

  @Post('changeOrder')
  async changeOrder(@Body() orderCourseUnitDto: OrderCourseUnitDto) {
    try {
      return await this.courseUnitsService.changeOrder(orderCourseUnitDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() getCourseUnitDto: GetCourseUnitDto) {
    try {
      return await this.courseUnitsService.findAll(getCourseUnitDto);
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
