import { Body, Controller, Post } from '@nestjs/common';
import { MailBody } from './mail.entity';
import { MailingServiceService } from './mailing-service.service';

@Controller('mailing-service')
export class MailingServiceController {
  constructor(private readonly mailerService: MailingServiceService) {}

  @Post('send-mail')
  sendEMail(@Body() mailDetails: any): Promise<any> {
    return this.mailerService.sendEMail(mailDetails);
  }
}
