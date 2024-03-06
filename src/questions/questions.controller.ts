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
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionDto } from './dto/get-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
import { OrderQuestionDto } from './dto/order-question.dto';

@ApiBearerAuth()
@Controller('questions')
@ApiTags('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return await this.questionsService.create(createQuestionDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('changeOrder')
  async changeOrder(@Body() orderQuestionDto: OrderQuestionDto) {
    try {
      return await this.questionsService.changeOrder(orderQuestionDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() getQuestionDto: GetQuestionDto) {
    try {
      return await this.questionsService.findAll(getQuestionDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.questionsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    try {
      return await this.questionsService.update(+id, updateQuestionDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.questionsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
