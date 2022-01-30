import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  UserRoleDto,
  RoleDto,
  UserDto,
  UserResponse,
  UserUpdateDto,
} from './user.entity';
import { UsersService } from './users.service';
import { AuthRole, Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(AuthRole.User)
  @ApiBearerAuth('Authorization')
  @Get('fetch')
  @ApiQuery({ name: 'user_id', required: false })
  getUsers(@Query('user_id') user_id?: string): Promise<UserResponse[]> {
    const args = [{ user_id }].filter(arg => {
      const argKeys = Object.keys(arg);
      if (arg[argKeys[0]]) {
        return arg;
      }
    });
    return this.userService.getAllUsers(...args);
  }

  @Post('create-user')
  registerUser(@Body() user: UserDto): Promise<any> {
    return this.userService.registerUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Delete('delete-user/:user_id')
  deleteUser(@Param('user_id') user_id: string): Promise<any> {
    return this.userService.deleteUser(user_id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('add-role')
  addRole(@Body() role: RoleDto): Promise<any> {
    return this.userService.addRole(role);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Delete('revoke-role/:role_id')
  revokeRole(@Param('role_id') role_id: string): Promise<any> {
    return this.userService.revokeRole(role_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Post('add-user-role')
  addUserRole(@Body() userRole: UserRoleDto): Promise<any> {
    return this.userService.addUserRole(userRole);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Delete('revoke-user-role/:role_id')
  revokeUserRole(@Param('role_id') role_id: string): Promise<any> {
    return this.userService.revokeUserRole(role_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('fetch-roles')
  fetchRoles(
    @Query('user_id') user_id: string,
  ): Promise<RoleDto[] | UserRoleDto[]> {
    const args = [{ user_id }].filter(arg => {
      const argKeys = Object.keys(arg);
      if (arg[argKeys[0]]) {
        return arg;
      }
    });

    return this.userService.getRoles(...args);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Put('update-user')
  updateUser(@Body() user: UserUpdateDto): Promise<any> {
    return this.userService.updateUser(user);
  }
}
