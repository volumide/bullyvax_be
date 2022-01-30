import {
  Table,
  Column,
  AllowNull,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/user.entity';

@Table
export class File extends Model<File> {
  // @Column({ primaryKey: true })
  // file_id: string;

  @AllowNull(false)
  @Column
  encoding: string;

  @AllowNull(false)
  @Column
  mimetype: string;

  @AllowNull(false)
  @Column
  destination: string;

  @AllowNull(false)
  @Column({ primaryKey: true })
  filename: string;

  @AllowNull(false)
  @Column
  path: string;

  @AllowNull(false)
  @Column
  size: number;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @BelongsTo(() => User)
  owner: User;
}

export class FileDto {
  encoding: string;

  mimetype: string;

  destination: string;

  filename: string;

  path: string;

  size: number;

  classification?: any;
}
