import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from './users/user.providers';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MailingServiceModule } from './mailing-service/mailing-service.module';
import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { ContentModule } from './content/content.module';
import { StripeModule } from 'nestjs-stripe';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
    StripeModule.forRoot({
      apiKey:
        'sk_test_51KOluiEvT7coUybkht9BPxb1DrKzSz4jpA775OxwCm6wzvLe1IvMgKHBsUZVs741ny1s3Xazb78d8DBUjTGx5L0o00mp7wIJgv',
      apiVersion: '2020-08-27',
    }),
    ConfigModule.forRoot(),
    FileUploadModule,
    NodeMailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_DEFAULT_SENDER || 'info@bullyvaxx.com',
      },
    }),
    MailingServiceModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...usersProviders],
  // exports: [JwtModule]
})
export class AppModule {}
