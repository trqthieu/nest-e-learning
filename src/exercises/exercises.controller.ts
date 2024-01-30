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
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { GetExerciseDto } from './dto/get-exercise.dto';
import { OrderExerciseDto } from './dto/order-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
@ApiTags('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    try {
      return await this.exercisesService.create(createExerciseDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('changeOrder')
  async changeOrder(@Body() orderExerciseDto: OrderExerciseDto) {
    try {
      return await this.exercisesService.changeOrder(orderExerciseDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() getExerciseDto: GetExerciseDto) {
    try {
      return await this.exercisesService.findAll(getExerciseDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.exercisesService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    try {
      return await this.exercisesService.update(+id, updateExerciseDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.exercisesService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
