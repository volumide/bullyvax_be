import { ApiProperty } from '@nestjs/swagger';

export class LoginDetails {
    @ApiProperty()
    username: string;
  
    @ApiProperty()
    password: string;
  
  }