import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileDto } from 'src/files/dtos/file.dto';
import { ImportFileValidationPipe } from 'src/files/dtos/file.validation';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionDto } from './dto/get-question.dto';
import { OrderQuestionDto } from './dto/order-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
import { Public } from 'src/auth/guards/roles.decorator';

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

  @Public()
  @Post('import/:examId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @Body() body: FileDto,
    @Param('examId') examId: string,
    @UploadedFile(
      ImportFileValidationPipe,
      new ParseFilePipeBuilder().build({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return await this.questionsService.importFile(+examId, file);
    } catch (error) {
      throw error;
    }
  }
}
