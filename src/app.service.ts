import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SeedsService } from './seeds/seed.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private seedsService: SeedsService) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.seedsService.seedUserData();
  }
}
