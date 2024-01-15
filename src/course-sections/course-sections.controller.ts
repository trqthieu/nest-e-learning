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
import { CourseSectionsService } from './course-sections.service';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/roles.decorator';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@Controller('course-sections')
@ApiTags('course-sections')
export class CourseSectionsController {
  constructor(private readonly courseSectionsService: CourseSectionsService) {}

  @Public()
  @Post()
  async create(@Body() createCourseSectionDto: CreateCourseSectionDto) {
    try {
      return await this.courseSectionsService.create(createCourseSectionDto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.courseSectionsService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.courseSectionsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseSectionDto: UpdateCourseSectionDto,
  ) {
    try {
      return await this.courseSectionsService.update(
        +id,
        updateCourseSectionDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.courseSectionsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
