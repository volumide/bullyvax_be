import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsToMany,
  IsEmail,
  AllowNull,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty, IsNumber } from 'class';

@Table
export class User extends Model<User> {
  @AllowNull(false)
  @Column
  username: string;

  @Column({ primaryKey: true })
  user_id: string;

  @AllowNull(true)
  @Column
  entity_name: string;

  @AllowNull(true)
  @Column
  first_name: string;

  @AllowNull(true)
  @Column
  middle_name: string;

  @AllowNull(true)
  @Column
  last_name: string;

  @AllowNull(true)
  @Column
  dob: string;

  @AllowNull(true)
  @Column
  phone: string;

  @AllowNull(false)
  @IsEmail
  @Column
  email: string;

  @AllowNull(true)
  @Column
  gender: string;

  @AllowNull(true)
  @Column
  state: string;

  @AllowNull(true)
  @Column
  county: string;

  @AllowNull(true)
  @Column
  password: string;

  @BelongsToMany(
    () => Role,
    () => UserRole,
  )
  roles: Role[];
}

@Table
export class School extends Model<School> {
  @Column({ primaryKey: true })
  school_id: string;

  @AllowNull(false)
  @Column
  school_name: string;

  @AllowNull(false)
  @Column
  zip_code: string;

  @HasMany(() => Sponsorship)
  sponsorships: Sponsorship[];

  @HasMany(() => Student)
  students: Student[];
}

@Table
export class Sponsor extends Model<Sponsor> {
  @Column({ primaryKey: true })
  sponsor_id: string;

  // @ForeignKey(() => User)
  // @Column
  // user_id: string;

  // @ForeignKey(() => Sponsorship)
  // @Column
  // sponsorship_id: string;

  // @HasMany(() => Sponsorship)
  // sponsorships: Sponsorship[];
}

@Table
export class Sponsorship extends Model<Sponsorship> {
  @Column({ primaryKey: true })
  sponsorship_id: string;

  @ForeignKey(() => School)
  @Column
  school_id: string;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @AllowNull(false)
  @Column
  quantity: string;

  @AllowNull(false)
  @Column
  expiry: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => School)
  school: School;
}

@Table
export class Student extends Model<Student> {
  @ForeignKey(() => School)
  @Column
  school_id: string;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @BelongsTo(() => School)
  school: School;
}

@Table
export class Role extends Model<Role> {
  @Column({ primaryKey: true })
  role_id: string;

  @AllowNull(false)
  @Column
  @ApiProperty()
  role: string;

  @BelongsToMany(
    () => User,
    () => UserRole,
  )
  users: User[];
}

@Table
export class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column
  user_id: string;

  @ForeignKey(() => Role)
  @Column
  role_id: string;

  @AllowNull(false)
  @Column
  isPrimary: boolean;
}

export class CreateChargeDto {
  @ApiProperty()
  paymentMethodId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  stripeID: string;
}

export class UserResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  middle_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  gender: string;
}

export class UserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  middle_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  county: string;

  @ApiProperty()
  sponsor_type: string;

  @ApiProperty()
  password: string;
}

export class UserUpdateDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  middle_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  password: string;
}

export class UserRoleDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  role: string;
}

export class RoleDto {
  @ApiProperty()
  role: string;
}

export class SponsorshipDto {
  sponsorship_id: string;

  @ApiProperty()
  school_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  quantity: string;

  @ApiProperty()
  expiry: string;
}

export class StudentDto {
  @ApiProperty()
  school_id: string;

  @ApiProperty()
  user_id: string;
}

export class SchoolDto {
  school_id: string;

  @ApiProperty()
  school_name: string;

  @ApiProperty()
  zip_code: string;
}

export class SponsorDto {
  @ApiProperty()
  sponsorship_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  sponsor_type: string;
}
