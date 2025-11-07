import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  @IsNotEmpty()
  start_datetime!: string;

  @IsDateString()
  @IsNotEmpty()
  end_datetime!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsOptional()
  banner_image?: string;

  @IsUUID()
  @IsNotEmpty()
  listing_id!: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  start_datetime?: string;

  @IsDateString()
  @IsOptional()
  end_datetime?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  banner_image?: string;
}
