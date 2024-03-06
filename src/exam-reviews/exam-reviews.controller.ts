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
import { ExamReviewsService } from './exam-reviews.service';
import { CreateExamReviewDto } from './dto/create-exam-review.dto';
import { UpdateExamReviewDto } from './dto/update-exam-review.dto';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('exam-reviews')
@ApiTags('exam-reviews')
export class ExamReviewsController {
  constructor(private readonly examReviewsService: ExamReviewsService) {}

  @Post()
  async create(@Body() createExamReviewDto: CreateExamReviewDto) {
    try {
      return await this.examReviewsService.create(createExamReviewDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.examReviewsService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.examReviewsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExamReviewDto: UpdateExamReviewDto,
  ) {
    try {
      return await this.examReviewsService.update(+id, updateExamReviewDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.examReviewsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
