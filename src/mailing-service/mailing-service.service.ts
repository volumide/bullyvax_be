import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class MailingServiceService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }
  async sendEMail(mailDetails: SendGrid.MailDataRequired): Promise<any> {
    try {
      const transport = await SendGrid.send(mailDetails);
      // console.log(`E-mail sent to ${mailDetails.to}`);
      return transport;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  // async sendEMail(mailDetails: MailBody): Promise<any> {
  //   try {
  //     const { recipient, subject, htmlBody, sender } = mailDetails;
  //     const response = await this.nodeMailerService.sendMail({
  //       to: recipient, // list of receivers
  //       from: sender ? sender : process.env.SMTP_DEFAULT_SENDER, // sender address
  //       subject: subject, // Subject line
  //       // text: 'welcome', // plaintext body
  //       html: htmlBody, // HTML body content
  //     });

  //     return response;
  //   } catch (error) {
  //     throw new HttpException(error, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
