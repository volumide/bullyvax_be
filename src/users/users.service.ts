import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

import { v4 as uuidGenerator } from 'uuid';
import {
  UserRoleDto,
  Role,
  RoleDto,
  User,
  UserResponse,
  UserRole,
  UserUpdateDto,
} from './user.entity';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import {
  ROLES_REPOSITORY,
  USERS_REPOSITORY,
  USER_ROLES_REPOSITORY,
} from '../constants';
import { LoginDetails } from '../app.entity';

export interface UserInfo {
  username: string;
  user_id?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  gender: string;
  password: string;
  phone: string;
  email: string;
  entity_name?: string;
  quantity?: string;
  user?: any;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(USERS_REPOSITORY) private usersRepository: typeof User,
    @Inject(ROLES_REPOSITORY) private rolesRepository: typeof Role,
    @Inject(USER_ROLES_REPOSITORY) private userRolesRepository: typeof UserRole,
  ) {}

  async registerUser(userInfo: UserInfo): Promise<any> {
    if (!userInfo?.email) {
      throw new HttpException('Invalid user details', HttpStatus.BAD_REQUEST);
    }

    let userExists: User = null;
    userExists = await this.getSingleUser(
      ['username', 'email'],
      'either',
      userInfo,
    );

    if (userExists && !userInfo.quantity) {
      throw new HttpException(
        'User with the same detail(s) already exists.',
        HttpStatus.BAD_REQUEST,
      );
    } else if (userExists && userInfo.quantity) {
      delete userExists['password'];

      return {
        message: 'User is verified, proceed with payment.',
        user: userExists,
      };
    }

    // generate uuid - user_id
    userInfo.user_id = uuidGenerator();

    // verify role
    const roleFound = await this.rolesRepository.findOne<Role>({
      where: { role: userInfo['role'] || 'USER' },
    });
    if (!roleFound) {
      throw new HttpException(
        'Access rights cannot be granted to this user. No defined system roles found, contact the admin.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userInfo.password) {
      userInfo.password = await bcrypt.hash(userInfo.password, 10);
    } else {
      userInfo.password = await bcrypt.hash('dfdtgt567y', 10);
    }
    // const stripeId = await this.stripeClient.customers.create({
    //   email: userInfo.email,
    // });
    // userInfo.stripe_id = stripeId;
    const userRole = new UserRole({
      role_id: roleFound.role_id,
      user_id: userInfo.user_id,
    });

    const user: User = await this.usersRepository.create<User>(userInfo);
    const otherRoles = await user.$get('roles');
    if (user) {
      if (otherRoles && otherRoles.length > 0) {
        // inserting into UserRoles through-table)
        await user.$add('roles', userRole.role_id, {
          through: { isPrimary: false },
        });
      } else {
        // inserting into UserRoles through-table)
        await user.$add('roles', userRole.role_id, {
          through: { isPrimary: true },
        });
      }

      delete user['password'];

      return {
        message: 'User created successfully',
        user,
      };
    }
  }

  async deleteUser(user_id: string): Promise<any> {
    const deletedUser = await this.usersRepository.destroy({
      where: { user_id },
    });
    if (!deletedUser) {
      throw new HttpException('Cannot revoke', HttpStatus.BAD_REQUEST);
    }
    return {
      message: 'User deleted',
    };
  }

  async updateUser(userInfo: UserUpdateDto): Promise<any> {
    if (userInfo.password) {
      userInfo.password = await bcrypt.hash(userInfo.password, 10);
    }
    await this.usersRepository.update<User>(userInfo, {
      where: { user_id: userInfo.user_id },
    });
    return {
      message: 'User details updated successfully',
    };
  }

  async getAllUsers(...params: any[]): Promise<UserResponse[]> {
    // console.log('params', params);

    let users: User[];
    if (params.length > 0) {
      users = await this.usersRepository.findAll({
        where: { [Op.and]: [...params.map(param => param)] },
      });
    } else {
      users = await this.usersRepository.findAll();
    }

    return users;
  }

  async getSingleUser(
    findBy: string[],
    check: 'either' | 'all',
    userDetails: User | LoginDetails | any,
  ): Promise<User> {
    let operator: any;
    if (check === 'either') {
      operator = {
        [Op.or]: [
          ...findBy.map(prop => {
            return { [prop]: userDetails[prop] };
          }),
        ],
      };
    } else {
      operator = {
        [Op.and]: [
          ...findBy.map(prop => {
            return { [prop]: userDetails[prop] };
          }),
        ],
      };
    }
    const user = await this.usersRepository.findOne<User>({
      where: operator,
    });
    if (user) {
      return user;
    }
  }

  async addRole(roleInfo: RoleDto): Promise<any> {
    const roleExists = await this.rolesRepository.findOne<Role>({
      where: { role: roleInfo.role },
    });
    if (roleExists) {
      throw new HttpException('Role already exists.', HttpStatus.BAD_REQUEST);
    }
    roleInfo['role_id'] = uuidGenerator();
    await this.rolesRepository.create(roleInfo);
    return {
      message: 'Role added successfully',
    };
  }

  async addUserRole(roleInfo: UserRoleDto): Promise<any> {
    // verify role existance in DB
    const roleFound: Role = await this.rolesRepository.findOne<Role>({
      where: { role: roleInfo['role'] },
    });
    if (!roleFound) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const userHasRole = await this.getRoles([
      { user_id: roleInfo.user_id, role_id: roleFound.role_id },
    ]);
    if (userHasRole.length > 0) {
      throw new HttpException(
        'User already has this role',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getSingleUser(['user_id'], 'either', roleInfo);
    await user.$add('roles', roleFound.role_id, {
      through: { isPrimary: false },
    });
    // console.log('newRole', newRole);

    return {
      message: 'User role added successfully',
    };
  }

  async getRoles(...params: any[]): Promise<RoleDto[] | UserRoleDto[]> {
    let roles: RoleDto[] | UserRoleDto[];
    if (params.length > 0) {
      roles = await this.userRolesRepository.findAll({
        where: { [Op.and]: [...params.map(param => param)] },
      });
    } else {
      roles = await this.rolesRepository.findAll();
    }
    return roles;
  }

  async revokeRole(role_id: string): Promise<any> {
    const revokedRole = await this.rolesRepository.destroy({
      where: { role_id },
    });
    if (!revokedRole) {
      throw new HttpException('Cannot revoke', HttpStatus.BAD_REQUEST);
    }
    return revokedRole;
  }

  async revokeUserRole(role_id: string): Promise<any> {
    const revokedRole = await this.userRolesRepository.destroy({
      where: { role_id, isPrimary: { [Op.ne]: 'true' } },
    });
    if (!revokedRole) {
      throw new HttpException(
        'Cannot revoke primary role',
        HttpStatus.BAD_REQUEST,
      );
    }
    return revokedRole;
  }
}
