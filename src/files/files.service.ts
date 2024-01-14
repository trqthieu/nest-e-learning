import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Excel from 'exceljs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { File } from 'src/entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async updateImage(file: Express.Multer.File) {
    const cloudFileResponse = await this.cloudinaryService.uploadImage(file);
    const fileEntity = new File();
    fileEntity.name = file.originalname;
    fileEntity.url = cloudFileResponse.url;
    fileEntity.format = cloudFileResponse.format;
    fileEntity.type = cloudFileResponse.resource_type;
    return await this.fileRepo.save(fileEntity);
  }

  async getDataFromExcel(file: Express.Multer.File): Promise<Array<any[]>> {
    const data = [];
    const workbook = new Excel.Workbook();
    const loadedWorkbook = await workbook.xlsx.load(file.buffer);
    const worksheet = loadedWorkbook.getWorksheet(1);
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const rowData = [];
      if (rowNumber !== 1) {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (cell.value === null || cell.value === undefined) {
            throw new BadRequestException(
              `Column ${colNumber} cannot be empty`,
            );
          }
          const cellValue = cell.value as any;
          const rawValue = cellValue?.text || cellValue;
          rowData.push(`${rawValue}`);
        });
        data.push(rowData);
      }
    });
    return data;
  }
}
