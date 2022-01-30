import { ApiProperty } from '@nestjs/swagger';
import { AllowNull, Column, Table } from 'sequelize-typescript';

export class MailBody {
  @ApiProperty()
  sender?: string;

  @ApiProperty()
  recipient: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  htmlBody: string;
}

@Table
export class MailSubscription {
  @Column({ primaryKey: true })
  subscription_id: string;

  @AllowNull(false)
  @Column
  user_type: string;
}
