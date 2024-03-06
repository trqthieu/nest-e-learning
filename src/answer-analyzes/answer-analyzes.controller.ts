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
import { AnswerAnalyzesService } from './answer-analyzes.service';
import { CreateAnswerAnalyzeDto } from './dto/create-answer-analyze.dto';
import { UpdateAnswerAnalyzeDto } from './dto/update-answer-analyze.dto';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('answer-analyzes')
@ApiTags('answer-analyzes')
export class AnswerAnalyzesController {
  constructor(private readonly answerAnalyzesService: AnswerAnalyzesService) {}

  @Post()
  async create(@Body() createAnswerAnalyzeDto: CreateAnswerAnalyzeDto) {
    try {
      return await this.answerAnalyzesService.create(createAnswerAnalyzeDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.answerAnalyzesService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.answerAnalyzesService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerAnalyzeDto: UpdateAnswerAnalyzeDto,
  ) {
    try {
      return await this.answerAnalyzesService.update(
        +id,
        updateAnswerAnalyzeDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.answerAnalyzesService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
