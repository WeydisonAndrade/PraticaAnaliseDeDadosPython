import { PrismaService } from '../prisma/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CreateContentDto } from './dto/content.dto';
export declare class ContentService {
    private readonly prisma;
    private readonly accessControl;
    constructor(prisma: PrismaService, accessControl: AccessControlService);
    findPublished(bandId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        priceCents: number | null;
        bandId: string;
        title: string;
        type: import(".prisma/client").$Enums.ContentType;
        accessLevel: import(".prisma/client").$Enums.AccessLevel;
        durationMin: number | null;
        thumbnailUrl: string | null;
        streamUrl: string | null;
        isPublished: boolean;
        publishedAt: Date | null;
    })[]>;
    create(userId: string, dto: CreateContentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCents: number | null;
        bandId: string;
        title: string;
        type: import(".prisma/client").$Enums.ContentType;
        accessLevel: import(".prisma/client").$Enums.AccessLevel;
        durationMin: number | null;
        thumbnailUrl: string | null;
        streamUrl: string | null;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    publish(contentId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priceCents: number | null;
        bandId: string;
        title: string;
        type: import(".prisma/client").$Enums.ContentType;
        accessLevel: import(".prisma/client").$Enums.AccessLevel;
        durationMin: number | null;
        thumbnailUrl: string | null;
        streamUrl: string | null;
        isPublished: boolean;
        publishedAt: Date | null;
    }>;
    getStreamUrl(contentId: string, userId: string): Promise<{
        streamUrl: string;
        title: string;
    }>;
}
