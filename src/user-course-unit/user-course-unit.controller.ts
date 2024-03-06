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
import { CreateUserCourseUnitDto } from './dto/create-user-course-unit.dto';
import { GetUserCourseUnitDto } from './dto/get-user-course-unit.dto';
import { UpdateUserCourseUnitDto } from './dto/update-user-course-unit.dto';
import { UserCourseUnitService } from './user-course-unit.service';

@ApiBearerAuth()
@Controller('user-course-unit')
@ApiTags('user-course-unit')
export class UserCourseUnitController {
  constructor(private readonly userCourseUnitService: UserCourseUnitService) {}

  @Post()
  async create(@Body() createUserCourseUnitDto: CreateUserCourseUnitDto) {
    try {
      return await this.userCourseUnitService.create(createUserCourseUnitDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() getUserCourseUnitDto: GetUserCourseUnitDto) {
    try {
      return await this.userCourseUnitService.findAll(getUserCourseUnitDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userCourseUnitService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserCourseUnitDto: UpdateUserCourseUnitDto,
  ) {
    try {
      return await this.userCourseUnitService.update(
        +id,
        updateUserCourseUnitDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userCourseUnitService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
