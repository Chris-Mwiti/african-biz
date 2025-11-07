import { IsString, IsNotEmpty, IsOptional, IsUrl, IsArray, IsBoolean, IsEnum } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class CreateListingDto {
  @IsString()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  website?: string;

  @IsArray()
  @IsOptional()
  social_links?: any;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsNotEmpty()
  category_id!: string;

  @IsBoolean()
  @IsOptional()
  is_premium?: boolean;
}

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  website?: string;

  @IsArray()
  @IsOptional()
  social_links?: any;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsBoolean()
  @IsOptional()
  is_premium?: boolean;
}

export class UpdateListingStatusDto {
  @IsEnum(ApprovalStatus)
  status!: ApprovalStatus;
}

