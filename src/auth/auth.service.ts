import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Role, User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { USER_ROLES_REPOSITORY } from '../constants';
import { LoginDetails } from '../app.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(USER_ROLES_REPOSITORY) private userRolesRepository: typeof UserRole,
  ) {}

  async validateUser(loginDetails: LoginDetails): Promise<any> {
    const user = await this.usersService.getSingleUser(
      ['username'],
      'either',
      loginDetails,
    );
    if (!user) {
      throw new HttpException(
        'Wrong username or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const passWordConfirmed = await bcrypt.compare(
      loginDetails.password,
      user.password,
    );
    if (user && passWordConfirmed) {
      return await this.login(user);
    }

    throw new HttpException(
      'Wrong username or password',
      HttpStatus.BAD_REQUEST,
    );
  }

  private async login(user: User): Promise<any> {
    const roles: Role[] = await user.$get('roles');
    let primaryRole: string;
    // console.log('roles', roles);

    if (roles.length > 0) {
      // get a user's primary role
      primaryRole = roles
        .filter(async role => {
          const roleId = role['dataValues'].role_id;
          const userRoles = await this.usersService.getRoles([
            { user_id: user.user_id },
            { role_id: roleId },
          ]);
          if (userRoles[0]['isPrimary']) {
            return role;
          }
        })[0]
        .getDataValue('role');
    } else {
      throw new HttpException(
        'User has no rights. Contact system admin.',
        HttpStatus.FORBIDDEN,
      );
    }

    // console.log('primaryRole', primaryRole);

    const payload = { sub: user.user_id, role: primaryRole };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: `${process.env.SECRET}`,
      }),
    };
  }
}
