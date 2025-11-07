import { UserStatus } from '../lib/types';
import { Role } from './auth.dto'; // Assuming Role is exported from auth.dto.ts

export interface UpdateUserStatusDto {
  status: UserStatus;
}

export interface UpdateUserRoleDto {
  role: Role;
}
