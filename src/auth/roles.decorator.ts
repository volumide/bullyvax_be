import { SetMetadata } from '@nestjs/common';

export enum AuthRole {
    User = 'USER',
    Admin = 'ADMIN',
  }

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AuthRole[]): any => SetMetadata(ROLES_KEY, roles);