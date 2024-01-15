import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from './pagination-option.interface';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly totalItem: number;

  @ApiProperty()
  readonly totalPage: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.totalItem = itemCount;
    this.totalPage = Math.ceil(this.totalItem / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPage;
  }
}
