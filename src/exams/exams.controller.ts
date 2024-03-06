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
import { CreateExamDto } from './dto/create-exam.dto';
import { GetExamDto } from './dto/get-exam.dto';
// import { OrderExamDto } from './dto/order-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamsService } from './exams.service';

@ApiBearerAuth()
@Controller('exams')
@ApiTags('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  async create(@Body() createExamDto: CreateExamDto) {
    try {
      return await this.examsService.create(createExamDto);
    } catch (error) {
      throw error;
    }
  }

  // @Post('changeOrder')
  // async changeOrder(@Body() orderExamDto: OrderExamDto) {
  //   try {
  //     return await this.examsService.changeOrder(orderExamDto);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Get()
  async findAll(@Query() getExamDto: GetExamDto) {
    try {
      return await this.examsService.findAll(getExamDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.examsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    try {
      return await this.examsService.update(+id, updateExamDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.examsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
