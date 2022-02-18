import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from '../users/user.providers';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    ...usersProviders,
    JwtStrategy,
    ConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
