import { z } from 'zod';

export enum Role {
  MEMBER = 'MEMBER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
}

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  country_of_residence: z.string().min(1, { message: 'Country of residence is required' }),
});

export type SignUpDto = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInDto = z.infer<typeof SignInSchema>;



import { UserStatus } from '../../lib/types'; // Import UserStatus



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
