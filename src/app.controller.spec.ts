import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { usersProviders } from './users/user.providers';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AuthService, UsersService, JwtService, ...usersProviders, {provide: 'JWT_MODULE_OPTIONS', useValue: {}}],
    }).compile();

    jwtService = app.get<JwtService>(JwtService);
    authService = app.get<AuthService>(AuthService);
    usersService = app.get<UsersService>(UsersService);
    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

});
