/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
  CreateChargeDto,
  ReportDto,
} from './user.entity';
import { UsersService } from './users.service';
import { AuthRole, Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { v4 as uuidGenerator } from 'uuid';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    @InjectStripe() private stripe: Stripe, //private stripeService: StripeService,
  ) {}

  @Post('stripe/payment')
  async payment(@Body() data: any) {
    try {
      const { token, quantity, price } = data;

      const customer = await this.stripe.customers.create({
        email: token.email,
        source: token.id,
      });
      const idempotencyKey = uuidGenerator();
      const charge = await this.stripe.charges.create(
        {
          amount: price * quantity,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          description: `Bullyvax sponsorship`,
        },
        {
          idempotencyKey,
        },
      );
      return charge;
    } catch (error) {
      return error;
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Roles(AuthRole.User)
  // @ApiBearerAuth('Authorization')
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
  async registerUser(@Body() user: UserDto): Promise<any> {
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
  @Post('report')
  report(@Body() report: ReportDto): Promise<any> {
    return this.userService.createReport(report);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('report')
  getReport(): Promise<ReportDto[]> {
    return this.userService.getAllReport();
  }

  @Post('report-request')
  reportRequest(@Body() report: any): Promise<any> {
    report.id = uuidGenerator();
    return this.userService.saveRequest(report);
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('Authorization')
  // @Put('update-user')
  // updateUser(@Body() user: UserUpdateDto): Promise<any> {
  //   return this.userService.updateUser(user);
  // }
}
