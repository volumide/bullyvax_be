import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from '../users/user.providers';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtModule.register({
    secret: `${process.env.SECRET}`,
    signOptions: { expiresIn: '1h' },
  })],
  providers: [AuthService, UsersService, ...usersProviders, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
