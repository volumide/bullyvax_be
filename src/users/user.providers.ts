import { USERS_REPOSITORY, ROLES_REPOSITORY, USER_ROLES_REPOSITORY, SPONSORSHIPS_REPOSITORY, SCHOOLS_REPOSITORY, STUDENTS_REPOSITORY } from '../constants';
import { Role, School, Sponsorship, Student, User, UserRole } from './user.entity';

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
];