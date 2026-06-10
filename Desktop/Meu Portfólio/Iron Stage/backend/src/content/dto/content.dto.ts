import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AccessLevel, ContentType } from '@prisma/client';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  bandId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ContentType)
  type!: ContentType;

  @IsEnum(AccessLevel)
  @IsOptional()
  accessLevel?: AccessLevel;

  @IsInt()
  @IsOptional()
  @Min(1)
  durationMin?: number;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  streamUrl?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  priceCents?: number;
}

export class PublishContentDto {
  @IsString()
  @IsNotEmpty()
  contentId!: string;
}
