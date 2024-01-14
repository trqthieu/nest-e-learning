import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { checkPassword, hashPassword } from './utils/auth.util';
import { RegisterDto } from './dtos/register.dto';
import { ErrorMessage } from 'src/utils/constants/error-message.constant';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepo.findOneBy({
      email,
    });
    if (!user || !(await checkPassword(password, user.password))) {
      throw new BadRequestException(
        ErrorMessage.EMAIL_OR_PASSWORD_IS_NOT_CORRECT,
      );
    }
    if (!user.isVerify) {
      throw new BadRequestException(ErrorMessage.USER_HAS_NOT_VERIFIED);
    }
    const payload = { id: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.userRepo.findOneBy({
      email,
    });
    if (user) {
      throw new BadRequestException(ErrorMessage.EMAIL_HAS_EXISTED);
    }
    const hash = await hashPassword(password);
    const createdUser = await this.userRepo.save({
      ...registerDto,
      password: hash,
    });
    await this.mailService.sendUserRegister(
      createdUser,
      'tokenwillbegeneratedlater',
    );
    return createdUser;
  }
}
