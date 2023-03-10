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
  // HasOne,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty, IsNumber } from 'class';

// @Table
// export class Bully extends Model<Bully> {
//   @Column({ primaryKey: true })
//   bully_id: string;

//   @AllowNull(true)
//   @Column
//   bully_name: string;

//   @AllowNull(true)
//   @Column
//   bully_grade: string;

// 	@AllowNull(true)
//   @Column
//   bully_gender: string;

// 	@ForeignKey(() => Report)
//   @Column
//   report_id: string;

//   @BelongsTo(() => Report)
//   report: Report[];
// }
@Table
export class Bully extends Model<Bully> {
  @Column({ primaryKey: true })
  bully_id: string;

  @AllowNull(true)
  @Column
  bully_name: string;

  @AllowNull(true)
  @Column
  bully_grade: string;

  @AllowNull(true)
  @Column
  bully_gender: string;

  @ForeignKey(() => Report)
  @Column
  report_id: string;

  @BelongsTo(() => Report)
  report: Report[];
}
@Table
export class Report extends Model<Report> {
  @AllowNull(false)
  @Column
  full_name: string;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column({ primaryKey: true })
  report_id: string;

  @AllowNull(true)
  @Column
  phone: string;

  @AllowNull(true)
  @Column
  bully_teacher: string;

  @AllowNull(true)
  @Column
  report_type: string;

  @AllowNull(true)
  @Column
  zip_code: string;

  @AllowNull(true)
  @IsEmail
  @Column
  email: string;

  @AllowNull(true)
  @Column
  school_name: string;

  @AllowNull(true)
  @IsEmail
  @Column
  admin_email: string;

  @AllowNull(true)
  @Column
  bully_finitial: string;

  @AllowNull(true)
  @Column
  bully_lname: string;

  @AllowNull(true)
  @Column
  bully_fullname: string;

  @AllowNull(true)
  @Column
  gender: string;

  @AllowNull(true)
  @Column
  bully_grade: string;

  @AllowNull(true)
  @Column
  incident_date: string;

  @AllowNull(true)
  @Column
  incident_time: string;

  @AllowNull(true)
  @Column
  staff_witnessed: string;

  @AllowNull(true)
  @Column
  staff_witness: string;

  @AllowNull(true)
  @Column
  staff_action: string;

  @AllowNull(true)
  @Column
  incident_place: string;

  @AllowNull(true)
  @Column
  physically_abused: string;

  @AllowNull(true)
  @Column
  victim_handicapped: string;

  @AllowNull(true)
  @Column
  victim_younger: string;

  @AllowNull(true)
  @Column
  details: string;

  @AllowNull(true)
  @Column
  serial_bully: string;

  @AllowNull(true)
  @Column
  other_incidents: string;

  @BelongsTo(() => User)
  user: User[];

  @HasMany(() => Bully)
  bully: Bully[];
}
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

  @AllowNull(true)
  @Column
  description: string;

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

  @HasMany(() => Report)
  report: Report[];
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
export class ReportRequest extends Model<ReportRequest> {
  @AllowNull(true)
  @Column
  schoolName: string;

  @AllowNull(true)
  @Column
  zipCode: string;

  @AllowNull(true)
  @Column
  bullyName: string;

  @AllowNull(true)
  @Column
  bullyGrade: string;

  @AllowNull(true)
  @Column
  bullyTeacher: string;

  @AllowNull(true)
  @Column
  bullyGender: string;

  @AllowNull(true)
  @Column
  bullyNumber: string;

  @AllowNull(true)
  @Column
  bullyvaxNumber: string;

  @AllowNull(true)
  @Column
  email: string;

  @Column({ primaryKey: true })
  id: string;
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

export class ReportDto {
  @ApiProperty()
  full_name: string;
  @ApiProperty()
  user_id: string;

  @ApiProperty() report_id: string;

  @ApiProperty()
  report_type: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  school_name: string;

  @ApiProperty()
  admin_email: string;

  @ApiProperty()
  bully_finitial: string;

  @ApiProperty()
  bully_teacher: string;

  @ApiProperty()
  zip_code: string;

  @ApiProperty()
  bully_lname: string;

  @ApiProperty()
  bully_fullname: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  bully_grade: string;

  @ApiProperty()
  incident_date: string;

  @ApiProperty()
  incident_time: string;

  @ApiProperty()
  staff_witnessed: string;

  @ApiProperty()
  staff_witness: string;

  @ApiProperty()
  staff_action: string;

  @ApiProperty()
  incident_place: string;

  @ApiProperty()
  physically_abused: string;

  @ApiProperty()
  victim_handicapped: string;

  @ApiProperty()
  victim_younger: string;

  @ApiProperty()
  details: string;

  @ApiProperty()
  serial_bully: string;

  @ApiProperty()
  other_incidents: string;
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
  description: string;

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
  quantity?: string;

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
