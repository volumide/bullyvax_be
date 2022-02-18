import { Module } from '@nestjs/common';
import { MailingServiceController } from './mailing-service.controller';
import { MailingServiceService } from './mailing-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [MailingServiceController],
  providers: [MailingServiceService],
})
export class MailingServiceModule {}
