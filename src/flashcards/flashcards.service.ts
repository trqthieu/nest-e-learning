import { Injectable } from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FlashcardGroup } from 'src/entities/flashcard-group.entity';
import { Repository } from 'typeorm';
import { Flashcard } from 'src/entities/flashcard.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(FlashcardGroup)
    private flashcardGroupRepo: Repository<FlashcardGroup>,
    @InjectRepository(Flashcard)
    private flashcardRepo: Repository<Flashcard>,
  ) {}
  async create(createFlashcardDto: CreateFlashcardDto) {
    const flashcardGroup = await this.flashcardGroupRepo.findOneBy({
      id: createFlashcardDto.flashcardGroupId,
    });
    const flashcard = await this.flashcardRepo.create({
      ...createFlashcardDto,
      flashcardGroup: flashcardGroup,
    });
    return await this.flashcardRepo.save(flashcard);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.flashcardRepo.createQueryBuilder('flashcard');
    queryBuilder
      .leftJoinAndSelect('flashcard.flashcardGroup', 'flashcard_group')
      .leftJoinAndSelect('flashcard.flashcardItems', 'flashcard_item')
      .orderBy('flashcard.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.flashcardRepo.findOne({
      where: {
        id,
      },
      relations: {
        flashcardGroup: true,
        flashcardItems: true,
      },
    });
  }

  async update(id: number, updateFlashcardDto: UpdateFlashcardDto) {
    const flashcardGroup = await this.flashcardGroupRepo.findOneBy({
      id: updateFlashcardDto.flashcardGroupId,
    });
    const flashcard = await this.flashcardRepo.create({
      id,
      ...updateFlashcardDto,
      flashcardGroup: flashcardGroup,
    });
    return await this.flashcardRepo.save(flashcard);
  }

  async remove(id: number) {
    return await this.flashcardRepo.softDelete({
      id: +id,
    });
  }
}
