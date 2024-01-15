import * as Excel from 'exceljs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Public, Roles } from 'src/auth/guards/roles.decorator';
import { ERole } from 'src/auth/dtos/role.enum';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';
import { Response } from 'express';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from 'src/files/dtos/file.dto';
import { ImportFileValidationPipe } from 'src/files/dtos/file.validation';
import { readFileSync } from 'fs';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    try {
      return await this.usersService.createUser(user);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get()
  async getUsers(@Query() pageOptionsDto: PageOptionsDto) {
    try {
      return this.usersService.getUsers(pageOptionsDto);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get(':id')
  async getUserDetail(@Param('id') id: string) {
    try {
      return await this.usersService.getUserDetail(id);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    try {
      return await this.usersService.updateUser(id, user);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.usersService.deleteUser(id);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('template')
  async exportTemplateItem(@Res() res: Response) {
    const templateFileName = 'users-import-template.xlsx';
    const workbook = new Excel.Workbook();
    const templateFilePath = join(
      __dirname,
      '..',
      'templates',
      templateFileName,
    );

    try {
      await workbook.xlsx.readFile(templateFilePath);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${templateFileName}`,
      );
      await workbook.xlsx.write(res);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('import')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @Body() body: FileDto,
    @UploadedFile(
      ImportFileValidationPipe,
      new ParseFilePipeBuilder().build({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return this.usersService.importFile(file);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('export')
  async exportUsers(
    @Res() res: Response,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    try {
      await this.usersService.exportUsers(pageOptionsDto);
      const filePath = join(__dirname, '..', 'templates', 'output.xlsx');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
      const buffer = readFileSync(filePath);
      res.send(buffer);
    } catch (error) {
      throw error;
    }
  }
}
