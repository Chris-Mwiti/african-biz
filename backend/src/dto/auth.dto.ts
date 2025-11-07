import { Role } from '@prisma/client';
import { UserStatus } from './user.dto';

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
  country_of_residence: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: Role;
  country_of_residence: string;
  profile_image?: string;
  created_at: Date;
  updated_at: Date;
  status: UserStatus; // Add status field
}
