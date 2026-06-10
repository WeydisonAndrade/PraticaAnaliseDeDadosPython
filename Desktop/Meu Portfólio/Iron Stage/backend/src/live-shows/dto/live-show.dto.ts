import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLiveShowDto {
  @IsString()
  @IsNotEmpty()
  bandId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  scheduledAt!: string;

  @IsDateString()
  @IsOptional()
  endsAt?: string;

  @IsInt()
  @Min(1)
  priceCents!: number;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}

export class PurchasePpvDto {
  @IsString()
  @IsNotEmpty()
  liveShowId!: string;
}
