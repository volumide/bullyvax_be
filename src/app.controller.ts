import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LoginDetails } from './app.entity';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { SponsorshipDto } from './users/user.entity';
import { UserInfo } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}

  // End point to authenticate a user
  @Post('auth/login')
  login(@Body() logins: LoginDetails): any {
    return this.authService.validateUser(logins);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('auth/confirm')
  confirmAuth(): any {
    return {
      message: 'OK',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('sponsorships')
  @ApiQuery({ name: 'zip_name', required: false })
  getSponsorships(
    @Query('zip_name') zip_name?: string,
  ): Promise<SponsorshipDto[]> {
    return this.appService.getSponsorships(zip_name);
  }

  @Post('sponsorships')
  createSponsorship(
    @Body() sponsorship: { userInfo: UserInfo; form: any },
  ): Promise<SponsorshipDto[]> {
    return this.appService.createSponsorship(sponsorship);
  }
}
