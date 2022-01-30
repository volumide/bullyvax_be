import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { usersProviders } from '../users/user.providers';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, ...usersProviders, JwtService, {provide: 'JWT_MODULE_OPTIONS', useValue: {}}],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user and generate access token', async () => {
    const result = {access_token: ''};
    jest.spyOn(service, 'validateUser').mockImplementation(async () => result);
    expect(await service.validateUser({username: 'elonaire', password: 'aseneka95'})).toBe(result);
  });
});
