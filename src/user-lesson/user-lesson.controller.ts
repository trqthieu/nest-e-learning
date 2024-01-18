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
import { UserLessonService } from './user-lesson.service';
import { CreateUserLessonDto } from './dto/create-user-lesson.dto';
import { UpdateUserLessonDto } from './dto/update-user-lesson.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@Controller('user-lesson')
@ApiTags('user-lesson')
export class UserLessonController {
  constructor(private readonly userLessonService: UserLessonService) {}

  @Post()
  async create(@Body() createUserLessonDto: CreateUserLessonDto) {
    try {
      return await this.userLessonService.create(createUserLessonDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.userLessonService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userLessonService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserLessonDto: UpdateUserLessonDto,
  ) {
    try {
      return await this.userLessonService.update(+id, updateUserLessonDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userLessonService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
