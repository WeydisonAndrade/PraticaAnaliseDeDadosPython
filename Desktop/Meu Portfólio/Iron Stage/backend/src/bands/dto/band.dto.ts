import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBandDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateBandDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class VerifyBandDto {
  @IsString()
  @IsNotEmpty()
  bandId!: string;
}

export class FollowBandDto {
  @IsString()
  @IsNotEmpty()
  bandId!: string;
}
