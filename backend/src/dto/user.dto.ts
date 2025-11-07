import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status!: UserStatus;
}

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role!: Role;
}
