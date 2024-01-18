import { Injectable } from '@nestjs/common';
import { CreateFlashcardItemDto } from './dto/create-flashcard-item.dto';
import { UpdateFlashcardItemDto } from './dto/update-flashcard-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flashcard } from 'src/entities/flashcard.entity';
import { FlashcardItem } from 'src/entities/flashcard-item.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class FlashcardItemsService {
  constructor(
    @InjectRepository(FlashcardItem)
    private flashcardItemRepo: Repository<FlashcardItem>,
    @InjectRepository(Flashcard)
    private flashcardRepo: Repository<Flashcard>,
  ) {}
  async create(createFlashcardItemDto: CreateFlashcardItemDto) {
    const flashcard = await this.flashcardRepo.findOneBy({
      id: createFlashcardItemDto.flashcardId,
    });
    const flashcardItem = await this.flashcardItemRepo.create({
      ...createFlashcardItemDto,
      flashcard: flashcard,
    });
    return await this.flashcardItemRepo.save(flashcardItem);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.flashcardItemRepo.createQueryBuilder('flashcard_item');
    queryBuilder
      .leftJoinAndSelect('flashcard_item.flashcard', 'flashcard')
      .orderBy('flashcard_item.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.flashcardItemRepo.findOne({
      where: {
        id,
      },
      relations: {
        flashcard: true,
      },
    });
  }

  async update(id: number, updateFlashcardItemDto: UpdateFlashcardItemDto) {
    const flashcard = await this.flashcardRepo.findOneBy({
      id: updateFlashcardItemDto.flashcardId,
    });
    const flashcardItem = await this.flashcardItemRepo.create({
      id,
      ...updateFlashcardItemDto,
      flashcard: flashcard,
    });
    return await this.flashcardItemRepo.save(flashcardItem);
  }

  async remove(id: number) {
    return await this.flashcardItemRepo.softDelete({
      id: +id,
    });
  }
}
