import { ApiProperty } from '@nestjs/swagger';
import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Content extends Model<Content> {
  @Column({ primaryKey: true })
  content_id: string;

  @AllowNull(false)
  @Column
  page: string;

  @AllowNull(true)
  @Column
  tab: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content: string;
}

export class ContentDto {
  content_id: string;

  @ApiProperty()
  page: string;

  @ApiProperty()
  tab: string;

  @ApiProperty()
  content: string;
}
