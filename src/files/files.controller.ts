import {
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/roles.decorator';
import { FileDto } from './dtos/file.dto';
import { ImageFileValidationPipe } from './dtos/file.validation';
import { FilesService } from './files.service';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private filesService: FilesService) {}
  @Public()
  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Body() body: FileDto,
    @UploadedFile(
      ImageFileValidationPipe,
      new ParseFilePipeBuilder().build({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const fileUploaded = this.filesService.updateImage(file);
      return fileUploaded;
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('upload-document')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Body() body: FileDto,
    @UploadedFile()
    // ImageFileValidationPipe,
    // new ParseFilePipeBuilder().build({
    //   fileIsRequired: true,
    // }),
    file: Express.Multer.File,
  ) {
    try {
      const fileUploaded = this.filesService.updateDocument(file);
      return fileUploaded;
    } catch (error) {
      throw error;
    }
  }
}
