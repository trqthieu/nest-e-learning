import { Injectable } from '@nestjs/common';
import { CreateFlashcardGroupDto } from './dto/create-flashcard-group.dto';
import { UpdateFlashcardGroupDto } from './dto/update-flashcard-group.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlashcardGroup } from 'src/entities/flashcard-group.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class FlashcardGroupsService {
  constructor(
    @InjectRepository(FlashcardGroup)
    private flashcardGroupRepo: Repository<FlashcardGroup>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(createFlashcardGroupDto: CreateFlashcardGroupDto) {
    const author = await this.userRepo.findOneBy({
      id: createFlashcardGroupDto.authorId,
    });
    const flashcardGroup = await this.flashcardGroupRepo.create({
      ...createFlashcardGroupDto,
      author: author,
    });
    return await this.flashcardGroupRepo.save(flashcardGroup);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.flashcardGroupRepo.createQueryBuilder('flashcard_group');
    queryBuilder
      .leftJoinAndSelect('flashcard_group.author', 'user')
      .orderBy('flashcard_group.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.flashcardGroupRepo.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
        flashcards: true,
      },
    });
  }

  async update(id: number, updateFlashcardGroupDto: UpdateFlashcardGroupDto) {
    const author = await this.userRepo.findOneBy({
      id: updateFlashcardGroupDto.authorId,
    });
    const flashcardGroup = await this.flashcardGroupRepo.create({
      id: id,
      ...updateFlashcardGroupDto,
      author: author,
    });
    return await this.flashcardGroupRepo.save(flashcardGroup);
  }

  async remove(id: number) {
    return await this.flashcardGroupRepo.softDelete({
      id: +id,
    });
  }
}
