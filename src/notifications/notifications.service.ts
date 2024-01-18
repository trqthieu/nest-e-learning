import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Notification } from 'src/entities/notification.entity';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { PageDto } from 'src/paginations/page.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const fromUser = await this.userRepo.findOneBy({
      id: createNotificationDto.fromId,
    });
    const toUser = await this.userRepo.findOneBy({
      id: createNotificationDto.toId,
    });
    const notification = await this.notificationRepo.create({
      ...createNotificationDto,
      from: fromUser,
      to: toUser,
    });
    return await this.notificationRepo.save(notification);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.notificationRepo.createQueryBuilder('notification');
    queryBuilder
      .leftJoinAndSelect('notification.from', 'user')
      .leftJoinAndSelect('notification.to', 'user')
      .orderBy('notification.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    return await this.notificationRepo.findOne({
      where: {
        id,
      },
      relations: {
        from: true,
        to: true,
      },
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const fromUser = await this.userRepo.findOneBy({
      id: updateNotificationDto.fromId,
    });
    const toUser = await this.userRepo.findOneBy({
      id: updateNotificationDto.toId,
    });
    const notification = await this.notificationRepo.create({
      id,
      ...updateNotificationDto,
      from: fromUser,
      to: toUser,
    });
    return await this.notificationRepo.save(notification);
  }

  async remove(id: number) {
    return await this.notificationRepo.softDelete({
      id: +id,
    });
  }
}
