import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Article } from 'src/entities/article.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const article = await this.articleRepo.findOneBy({
      id: createCommentDto.articleId,
    });
    const user = await this.userRepo.findOneBy({
      id: createCommentDto.authorId,
    });
    const comment = await this.commentRepo.create({
      ...createCommentDto,
      article: article,
      author: user,
    });
    return await this.commentRepo.save(comment);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.commentRepo.createQueryBuilder('comment');
    queryBuilder
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('comment.author', 'user')
      .orderBy('comment.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.commentRepo.findOne({
      where: {
        id,
      },
      relations: {
        article: true,
        author: true,
      },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const article = await this.articleRepo.findOneBy({
      id: updateCommentDto.articleId,
    });
    const user = await this.userRepo.findOneBy({
      id: updateCommentDto.authorId,
    });
    const comment = await this.commentRepo.create({
      id: id,
      ...updateCommentDto,
      article: article,
      author: user,
    });
    return await this.commentRepo.save(comment);
  }

  async remove(id: number) {
    return await this.commentRepo.softDelete({
      id: +id,
    });
  }
}
