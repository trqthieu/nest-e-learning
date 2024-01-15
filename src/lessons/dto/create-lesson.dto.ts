import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  video: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  banner: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  attachments: string[];

  @ApiProperty()
  @IsInt()
  courseUnitId: number;
}
