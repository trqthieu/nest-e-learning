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
import { FlashcardGroupsService } from './flashcard-groups.service';
import { CreateFlashcardGroupDto } from './dto/create-flashcard-group.dto';
import { UpdateFlashcardGroupDto } from './dto/update-flashcard-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@Controller('flashcard-groups')
@ApiTags('flashcard-groups')
export class FlashcardGroupsController {
  constructor(
    private readonly flashcardGroupsService: FlashcardGroupsService,
  ) {}

  @Post()
  async create(@Body() createFlashcardGroupDto: CreateFlashcardGroupDto) {
    try {
      return await this.flashcardGroupsService.create(createFlashcardGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.flashcardGroupsService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.flashcardGroupsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlashcardGroupDto: UpdateFlashcardGroupDto,
  ) {
    try {
      return await this.flashcardGroupsService.update(+id, updateFlashcardGroupDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.flashcardGroupsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
