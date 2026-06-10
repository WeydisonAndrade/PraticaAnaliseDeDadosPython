import { PrismaService } from '../prisma/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CommissionService } from '../commission/commission.service';
import { CreateLiveShowDto } from './dto/live-show.dto';
export declare class LiveShowsService {
    private readonly prisma;
    private readonly accessControl;
    private readonly commissionService;
    constructor(prisma: PrismaService, accessControl: AccessControlService, commissionService: CommissionService);
    findUpcoming(): import(".prisma/client").Prisma.PrismaPromise<({
        band: {
            id: string;
            name: string;
            slug: string;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCents: number;
        status: import(".prisma/client").$Enums.LiveShowStatus;
        bandId: string;
        title: string;
        thumbnailUrl: string | null;
        streamUrl: string | null;
        scheduledAt: Date;
        endsAt: Date | null;
        maxViewers: number | null;
    })[]>;
    create(userId: string, dto: CreateLiveShowDto): Promise<{
        band: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            userId: string;
            bio: string | null;
            imageUrl: string | null;
            status: import(".prisma/client").$Enums.BandStatus;
            verifiedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCents: number;
        status: import(".prisma/client").$Enums.LiveShowStatus;
        bandId: string;
        title: string;
        thumbnailUrl: string | null;
        streamUrl: string | null;
        scheduledAt: Date;
        endsAt: Date | null;
        maxViewers: number | null;
    }>;
    purchaseTicket(userId: string, liveShowId: string): Promise<{
        ticket: {
            liveShow: {
                band: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    userId: string;
                    bio: string | null;
                    imageUrl: string | null;
                    status: import(".prisma/client").$Enums.BandStatus;
                    verifiedAt: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                priceCents: number;
                status: import(".prisma/client").$Enums.LiveShowStatus;
                bandId: string;
                title: string;
                thumbnailUrl: string | null;
                streamUrl: string | null;
                scheduledAt: Date;
                endsAt: Date | null;
                maxViewers: number | null;
            };
        } & {
            id: string;
            userId: string;
            paymentId: string;
            liveShowId: string;
            purchasedAt: Date;
            accessFrom: Date;
            accessUntil: Date;
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
    checkAccess(userId: string, liveShowId: string): Promise<{
        canAccess: boolean;
    }>;
}
