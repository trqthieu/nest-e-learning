import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { BASE_URL } from 'src/auth/constants/auth.constant';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserRegister(user: User, token: string) {
    const url = `${BASE_URL}/auth/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to E-Learning System! Confirm your email',
      template: './register',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    });
  }
}
