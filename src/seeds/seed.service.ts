import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from 'src/auth/dtos/role.enum';
import { hashPassword } from 'src/auth/utils/auth.util';
import configuration from 'src/configs/configuration';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async seedUserData() {
    const existedUser = await this.userRepo.findOne({
      where: {
        email: 'admin@gmail.com',
      },
    });
    if (!existedUser) {
      const user = new User();
      const hash = await hashPassword(configuration().admin.email);
      user.email = configuration().admin.password;
      user.password = hash;
      user.role = ERole.ADMIN;
      user.firstName = 'Super';
      user.lastName = 'Admin';
      user.phoneNumber = '0987654321';
      user.isVerify = true;
      await this.userRepo.save(user);
    }
  }
}
