import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ErrorMessage } from 'src/utils/constants/error-message.constant';
import { Repository } from 'typeorm';
import { UserToken } from './constants/auth.constant';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { checkPassword, hashPassword } from './utils/auth.util';

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
    const payload: UserToken = { id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getMe(user: UserToken) {
    const currentUser = await this.userRepo.findOne({
      where: {
        id: user.id,
      },
    });
    return currentUser;
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
    const token = await this.jwtService.signAsync({ id: createdUser.id });
    await this.mailService.sendUserRegister(createdUser, token);
    return createdUser;
  }

  async confirm(token: string) {
    const { id } = await this.jwtService.verifyAsync(token);
    if (!id) {
      return {};
    }
    const existedUser = await this.userRepo.findOne({ where: { id: id } });
    return await this.userRepo.save({
      ...existedUser,
      isVerify: true,
    });
  }
}
