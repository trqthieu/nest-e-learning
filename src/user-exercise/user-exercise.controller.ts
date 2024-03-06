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
import { UserExerciseService } from './user-exercise.service';
import { CreateUserExerciseDto } from './dto/create-user-exercise.dto';
import { UpdateUserExerciseDto } from './dto/update-user-exercise.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@ApiBearerAuth()
@Controller('user-exercise')
@ApiTags('user-exercise')
export class UserExerciseController {
  constructor(private readonly userExerciseService: UserExerciseService) {}

  @Post()
  async create(@Body() createUserExerciseDto: CreateUserExerciseDto) {
    try {
      return await this.userExerciseService.create(createUserExerciseDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.userExerciseService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userExerciseService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserExerciseDto: UpdateUserExerciseDto,
  ) {
    try {
      return await this.userExerciseService.update(+id, updateUserExerciseDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userExerciseService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
