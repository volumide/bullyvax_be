import {
  USERS_REPOSITORY,
  ROLES_REPOSITORY,
  USER_ROLES_REPOSITORY,
  SPONSORSHIPS_REPOSITORY,
  SCHOOLS_REPOSITORY,
  STUDENTS_REPOSITORY,
  REPORT_REPOSITORY,
	BULLY_REPOSITORY
} from '../constants';
import {
	Bully,
  Report,
  Role,
  School,
  Sponsorship,
  Student,
  User,
  UserRole,
} from './user.entity';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
  {
    provide: ROLES_REPOSITORY,
    useValue: Role,
  },
  {
    provide: USER_ROLES_REPOSITORY,
    useValue: UserRole,
  },
  {
    provide: SPONSORSHIPS_REPOSITORY,
    useValue: Sponsorship,
  },
  {
    provide: SCHOOLS_REPOSITORY,
    useValue: School,
  },
  {
    provide: STUDENTS_REPOSITORY,
    useValue: Student,
  },
  {
    provide: REPORT_REPOSITORY,
    useValue: Report,
  },
  {
    provide: BULLY_REPOSITORY,
    useValue: Bully,
  },
];
