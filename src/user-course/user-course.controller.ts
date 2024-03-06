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
import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { GetUserCourseDto } from './dto/get-user-course.dto';
import { UpdateUserCourseDto } from './dto/update-user-course.dto';
import { UserCourseService } from './user-course.service';

@ApiBearerAuth()
@Controller('user-course')
@ApiTags('user-course')
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Post()
  async create(@Body() createUserCourseDto: CreateUserCourseDto) {
    try {
      return await this.userCourseService.create(createUserCourseDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() getUserCourseDto: GetUserCourseDto) {
    try {
      return await this.userCourseService.findAll(getUserCourseDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userCourseService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserCourseDto: UpdateUserCourseDto,
  ) {
    try {
      return await this.userCourseService.update(+id, updateUserCourseDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userCourseService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
