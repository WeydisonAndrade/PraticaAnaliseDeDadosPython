import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly commissionService;
    constructor(prisma: PrismaService, commissionService: CommissionService);
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
    getActiveSubscription(userId: string): Promise<({
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
    subscribe(userId: string, planSlug: string): Promise<{
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
    cancel(userId: string): Promise<{
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
