import { MarketplaceService } from './marketplace.service';
import { CreateOrderDto, CreateProductDto } from './dto/marketplace.dto';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    findProducts(bandId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        band: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCents: number;
        isActive: boolean;
        imageUrl: string | null;
        bandId: string;
        type: import(".prisma/client").$Enums.ProductType;
        stock: number;
    })[]>;
    createProduct(user: {
        id: string;
    }, dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCents: number;
        isActive: boolean;
        imageUrl: string | null;
        bandId: string;
        type: import(".prisma/client").$Enums.ProductType;
        stock: number;
    }>;
    createOrder(user: {
        id: string;
    }, dto: CreateOrderDto): Promise<{
        order: {
            items: ({
                product: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    priceCents: number;
                    isActive: boolean;
                    imageUrl: string | null;
                    bandId: string;
                    type: import(".prisma/client").$Enums.ProductType;
                    stock: number;
                };
            } & {
                id: string;
                bandId: string;
                orderId: string;
                productId: string;
                quantity: number;
                unitPriceCents: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            userId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
            totalCents: number;
        };
        payments: {
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                currency: string;
                userId: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                bandId: string | null;
                type: import(".prisma/client").$Enums.TransactionType;
                grossAmountCents: number;
                platformFeeCents: number;
                bandAmountCents: number;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                externalId: string | null;
                paidAt: Date | null;
                orderId: string | null;
            };
            split: import("../common/types/business.types").RevenueSplit;
        }[];
    }>;
}
