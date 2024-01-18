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
import { QuestionSelectsService } from './question-selects.service';
import { CreateQuestionSelectDto } from './dto/create-question-select.dto';
import { UpdateQuestionSelectDto } from './dto/update-question-select.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@Controller('question-selects')
@ApiTags('question-selects')
export class QuestionSelectsController {
  constructor(
    private readonly questionSelectsService: QuestionSelectsService,
  ) {}

  @Post()
  async create(@Body() createQuestionSelectDto: CreateQuestionSelectDto) {
    try {
      return await this.questionSelectsService.create(createQuestionSelectDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.questionSelectsService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.questionSelectsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionSelectDto: UpdateQuestionSelectDto,
  ) {
    try {
      return await this.questionSelectsService.update(+id, updateQuestionSelectDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.questionSelectsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
