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
} from './user.entity';
import { UsersService } from './users.service';
import { AuthRole, Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    @InjectStripe() private stripe: Stripe, //private stripeService: StripeService,
  ) {}

  @Post('create/user/payment')
  async getTest(@Body() price: any) {
    try {
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL,
        line_items: [
          {
            price_data: {
              product_data: {
                name: 'Bullyvax sponsorship',
              },
              currency: 'USD',
              unit_amount: 6900, //(6900 * price.length),
            },
            quantity: price['price'].length,
          },
        ],
      });
    } catch (error) {
      return error;
    }
  }

  @Post('create/payment')
  async payment() {
    try {
      const payment = await this.stripe.paymentIntents.create({
        amount: 200000,
        currency: 'NGN',
        payment_method_types: ['card'],
      });
      console.log(payment);
      return payment;
    } catch (error) {
      console.log(this.payment);
      return error;
    }
  }

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
  @Put('update-user')
  updateUser(@Body() user: UserUpdateDto): Promise<any> {
    return this.userService.updateUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Put('update-user')
  newReport(@Body() report: any): Promise<any> {
    return this.userService.createReport(report);
  }
}
