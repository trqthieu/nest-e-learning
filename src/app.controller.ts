import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/guards/roles.decorator';
import { ERole } from './auth/dtos/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
