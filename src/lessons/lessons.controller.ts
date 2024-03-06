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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { GetLessonDto } from './dto/get-lesson.dto';
import { OrderLessonDto } from './dto/order-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@ApiBearerAuth()
@Controller('lessons')
@ApiTags('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto) {
    try {
      return await this.lessonsService.create(createLessonDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('changeOrder')
  async changeOrder(@Body() orderLessonDto: OrderLessonDto) {
    try {
      return await this.lessonsService.changeOrder(orderLessonDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() getLessonDto: GetLessonDto) {
    try {
      return await this.lessonsService.findAll(getLessonDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.lessonsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    try {
      return await this.lessonsService.update(+id, updateLessonDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.lessonsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
