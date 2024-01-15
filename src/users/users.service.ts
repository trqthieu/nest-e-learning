import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorMessage } from 'src/utils/constants/error-message.constant';
import { hashPassword } from 'src/auth/utils/auth.util';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { PageDto } from 'src/paginations/page.dto';
import { PageMetaDto } from 'src/paginations/page-meta.dto';
import { FilesService } from 'src/files/files.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { join } from 'path';
import * as Excel from 'exceljs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private filesService: FilesService,
  ) {}

  async createUser(user: CreateUserDto) {
    const { email, password } = user;
    const existedUser = await this.userRepo.findOneBy({
      email,
    });
    if (existedUser) {
      throw new BadRequestException(ErrorMessage.EMAIL_HAS_EXISTED);
    }
    const hash = await hashPassword(password);
    return await this.userRepo.save({ ...user, password: hash });
  }

  async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepo.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async getUserDetail(id: string) {
    return await this.userRepo.findOneBy({
      id: +id,
    });
  }

  async updateUser(id: string, user: UpdateUserDto) {
    const { email, password } = user;
    const existedUser = await this.userRepo.findOneBy({
      id: +id,
    });
    if (!existedUser) {
      throw new BadRequestException(ErrorMessage.USER_IS_NOT_EXISTS);
    }
    const userWithEmail = await this.userRepo.findOneBy({
      email,
    });
    if (userWithEmail && userWithEmail.id !== +id) {
      throw new BadRequestException(ErrorMessage.EMAIL_HAS_EXISTED);
    }
    const hash = await hashPassword(password);
    return await this.userRepo.save({ id: +id, ...user, password: hash });
  }

  async deleteUser(id: string) {
    return await this.userRepo.softDelete({
      id: +id,
    });
  }

  async importFile(file: Express.Multer.File) {
    const data = await this.filesService.getDataFromExcel(file);
    console.log('data', data);
    const listKey = [
      'email',
      'password',
      'firstName',
      'lastName',
      'phoneNumber',
      'EXP',
      'role',
      'isVerify',
    ];
    // data.forEach(async (item, index) => {
    const userList = [];
    const emailList = [];
    for (const item of data) {
      if (item.length !== listKey.length) {
        throw new BadRequestException(ErrorMessage.MISSING_DATA);
      }
      const userObject = {
        email: item[0],
        password: item[1],
        firstName: item[2],
        lastName: item[3],
        phoneNumber: item[4],
        EXP: +item[5],
        role: item[6],
        isVerify: String(item[7]).toLowerCase() === 'true',
      };

      const userDtoInstance = plainToClass(CreateUserDto, userObject);
      const errors = await validate(userDtoInstance);
      if (errors.length > 0) {
        throw new BadRequestException({
          message: Object.values(errors[0].constraints),
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      if (emailList.includes(userObject.email)) {
        throw new BadRequestException(ErrorMessage.EMAIL_IS_DUPLICATED);
      }
      emailList.push(userObject.email);
      const existedUser = await this.userRepo.findOne({
        where: {
          email: userObject.email,
        },
      });
      if (existedUser) {
        throw new BadRequestException(ErrorMessage.EMAIL_HAS_EXISTED);
      }
      const hash = await hashPassword(userObject.password);
      const user = { ...userObject, password: hash };
      userList.push(user);
    }
    return await this.userRepo.save([...userList]);
  }

  async exportUsers(pageOptionsDto: PageOptionsDto) {
    const response = await this.getUsers({
      ...pageOptionsDto,
      skip: 0,
      take: Number.MAX_SAFE_INTEGER,
    });
    const users = response.data;
    const data = users;
    const templateFileName = 'users-export-template.xlsx';
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(
      join(__dirname, '..', 'templates', templateFileName),
    );
    const worksheet = workbook.getWorksheet('Sheet1');
    let row = worksheet.getRow(1);
    row = worksheet.getRow(2);
    if (data.length > 1) {
      worksheet.duplicateRow(2, data.length - 1, true);
    }
    for (const [rowNum, inputData] of data.entries()) {
      const row = worksheet.getRow(rowNum + 2);
      row.getCell(1).value = inputData.email;
      row.getCell(2).value = inputData.password;
      row.getCell(3).value = inputData.firstName;
      row.getCell(4).value = inputData.lastName;
      row.getCell(5).value = inputData.phoneNumber;
      row.getCell(6).value = inputData.EXP;
      row.getCell(7).value = inputData.role;
      row.getCell(8).value = inputData.isVerify;
      const pathResult = join(__dirname, '..', 'templates', 'output.xlsx');
      await workbook.xlsx.writeFile(pathResult);
    }
  }
}
