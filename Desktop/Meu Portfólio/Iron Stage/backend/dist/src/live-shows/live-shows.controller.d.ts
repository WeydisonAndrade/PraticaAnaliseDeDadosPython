import { LiveShowsService } from './live-shows.service';
import { CreateLiveShowDto, PurchasePpvDto } from './dto/live-show.dto';
export declare class LiveShowsController {
    private readonly liveShowsService;
    constructor(liveShowsService: LiveShowsService);
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
    create(user: {
        id: string;
    }, dto: CreateLiveShowDto): Promise<{
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
    purchase(user: {
        id: string;
    }, dto: PurchasePpvDto): Promise<{
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
    checkAccess(user: {
        id: string;
    }, id: string): Promise<{
        canAccess: boolean;
    }>;
}
