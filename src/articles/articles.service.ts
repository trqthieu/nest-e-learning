import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const user = await this.userRepo.findOneBy({
      id: createArticleDto.authorId,
    });
    const article = await this.articleRepo.create({
      ...createArticleDto,
      author: user,
    });
    return await this.articleRepo.save(article);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.articleRepo.createQueryBuilder('article');
    queryBuilder
      .leftJoinAndSelect('article.author', 'user')
      .orderBy('article.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.articleRepo.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
        comments: true,
      },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const user = await this.userRepo.findOneBy({
      id: updateArticleDto.authorId,
    });
    const article = await this.articleRepo.create({
      id: id,
      ...updateArticleDto,
      author: user,
    });
    return await this.articleRepo.save(article);
  }

  async remove(id: number) {
    return await this.articleRepo.softDelete({
      id: +id,
    });
  }
}
