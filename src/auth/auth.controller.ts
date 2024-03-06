import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserToken } from './constants/auth.constant';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Public } from './guards/roles.decorator';
import { UserRequest } from './guards/user.decorator';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('getMe')
  async getMe(@UserRequest() user: UserToken) {
    try {
      return this.authService.getMe(user);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return this.authService.register(registerDto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    try {
      return this.authService.confirm(token);
    } catch (error) {
      throw error;
    }
  }
}
