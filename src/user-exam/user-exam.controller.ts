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
import { UserExamService } from './user-exam.service';
import { CreateUserExamDto } from './dto/create-user-exam.dto';
import { UpdateUserExamDto } from './dto/update-user-exam.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@Controller('user-exam')
@ApiTags('user-exam')
export class UserExamController {
  constructor(private readonly userExamService: UserExamService) {}

  @Post()
  async create(@Body() createUserExamDto: CreateUserExamDto) {
    try {
      return await this.userExamService.create(createUserExamDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.userExamService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userExamService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserExamDto: UpdateUserExamDto,
  ) {
    try {
      return await this.userExamService.update(+id, updateUserExamDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userExamService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
