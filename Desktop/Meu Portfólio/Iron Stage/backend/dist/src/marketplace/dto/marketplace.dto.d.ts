import { ProductType } from '@prisma/client';
export declare class CreateProductDto {
    bandId: string;
    name: string;
    description?: string;
    type: ProductType;
    priceCents: number;
    stock: number;
    imageUrl?: string;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress?: Record<string, string>;
}
export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
