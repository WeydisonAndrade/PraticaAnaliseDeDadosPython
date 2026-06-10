import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  bandId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductType)
  type!: ProductType;

  @IsInt()
  @Min(1)
  priceCents!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class CreateOrderDto {
  items!: OrderItemDto[];

  @IsOptional()
  shippingAddress?: Record<string, string>;
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
