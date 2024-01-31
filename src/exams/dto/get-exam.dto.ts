import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PageOptionsDto } from 'src/paginations/pagination-option.dto';

export class GetExamDto extends PageOptionsDto {}
