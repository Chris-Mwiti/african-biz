import { IsString, IsNotEmpty, IsOptional, IsEnum, IsJSON } from 'class-validator';
import { AnalyticEventType } from '@prisma/client'; // Import from Prisma client

export class TrackAnalyticEventDto {
  @IsString()
  @IsNotEmpty()
  listingId!: string;

  @IsEnum(AnalyticEventType)
  @IsNotEmpty()
  eventType!: AnalyticEventType;

  @IsJSON()
  @IsOptional()
  details?: string; // JSON string
}
