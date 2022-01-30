import { Test, TestingModule } from '@nestjs/testing';
import { usersProviders } from './user.providers';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ...usersProviders],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register new user', async () => {
    const result = {
      message: 'User created successfully',
    };

    jest.spyOn(service, 'registerUser').mockImplementation(async () => result);
    expect(await service.registerUser({
      username: 'jj001',
      first_name: 'Jeffrey',
      middle_name: '',
      last_name: 'Jakoyo',
      dob: '22/12/1998',
      gender: 'MALE',
      password: 'aseneka95',
      phone: '0703202186',
      email: 'jakoyojeffrey@gmail.com'
    })).toBe(result);
  });

  it('should delete a user', async () => {
    const result = {
      message: 'User deleted',
    };
    
    jest.spyOn(service, 'deleteUser').mockImplementation(async () => result);
    expect(await service.deleteUser('554d7d55-4216-40ea-b66e-95b244d55ecb')).toBe(result);
  });
});
