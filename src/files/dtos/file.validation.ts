import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ErrorMessage } from 'src/utils/constants/error-message.constant';

@Injectable()
export class ImportFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file?.originalname.match(/\.(xlsx|csv)$/)) {
      throw new BadRequestException(ErrorMessage.INVALID_FILE_TYPE);
    }
    return file;
  }
}

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file?.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException(ErrorMessage.INVALID_FILE_TYPE);
    }
    const maxFileSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSizeInBytes) {
      throw new BadRequestException(
        'File size exceeds the maximum allowed (10MB)',
      );
    }
    return file;
  }
}
