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
import { FlashcardItemsService } from './flashcard-items.service';
import { CreateFlashcardItemDto } from './dto/create-flashcard-item.dto';
import { UpdateFlashcardItemDto } from './dto/update-flashcard-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

@Controller('flashcard-items')
@ApiTags('flashcard-items')
export class FlashcardItemsController {
  constructor(private readonly flashcardItemsService: FlashcardItemsService) {}

  @Post()
  async create(@Body() createFlashcardItemDto: CreateFlashcardItemDto) {
    try {
      return await this.flashcardItemsService.create(createFlashcardItemDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return await this.flashcardItemsService.findAll(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.flashcardItemsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlashcardItemDto: UpdateFlashcardItemDto,
  ) {
    try {
      return await this.flashcardItemsService.update(
        +id,
        updateFlashcardItemDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.flashcardItemsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
