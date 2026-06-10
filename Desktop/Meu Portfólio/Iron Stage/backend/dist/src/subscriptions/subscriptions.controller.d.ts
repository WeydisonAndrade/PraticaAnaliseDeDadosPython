import { SubscriptionsService } from './subscriptions.service';
import { SubscribeDto } from './dto/subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    findPlans(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        priceCents: number;
        currency: string;
        intervalDays: number;
        features: string[];
        isActive: boolean;
    }[]>;
    getMySubscription(user: {
        id: string;
    }): Promise<({
        plan: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            priceCents: number;
            currency: string;
            intervalDays: number;
            features: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planId: string;
        startsAt: Date;
        expiresAt: Date;
        cancelledAt: Date | null;
    }) | null>;
    subscribe(user: {
        id: string;
    }, dto: SubscribeDto): Promise<{
        subscription: {
            plan: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                priceCents: number;
                currency: string;
                intervalDays: number;
                features: string[];
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            planId: string;
            startsAt: Date;
            expiresAt: Date;
            cancelledAt: Date | null;
        };
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
    }>;
    cancel(user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planId: string;
        startsAt: Date;
        expiresAt: Date;
        cancelledAt: Date | null;
    }>;
}
