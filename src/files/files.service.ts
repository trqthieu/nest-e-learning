import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Excel from 'exceljs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { File } from 'src/entities/file.entity';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

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

  async updateDocument(file: Express.Multer.File) {
    const bucket = admin.storage().bucket();
    const fileName = `${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    const url = (await new Promise((resolve, reject) => {
      stream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`;
        resolve(publicUrl);
      });
      stream.on('error', reject);
      stream.end(file.buffer);
    })) as string;
    const [type, format] = file.mimetype.split('/');
    const fileEntity = new File();
    fileEntity.name = file.originalname;
    fileEntity.url = url;
    fileEntity.format = format;
    fileEntity.type = type;
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
