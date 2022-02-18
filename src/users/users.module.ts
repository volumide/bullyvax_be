import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './user.providers';
import { AuthModule } from '../auth/auth.module';
import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [UsersService, ...usersProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
