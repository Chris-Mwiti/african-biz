import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  stripeSubscriptionId!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsNotEmpty()
  plan!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startedAt!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endsAt!: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  lastPaymentAt?: Date;
}

export class UpdateSubscriptionDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  plan?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startedAt?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endsAt?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  lastPaymentAt?: Date;
}