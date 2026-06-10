import { ContentService } from './content.service';
import { CreateContentDto } from './dto/content.dto';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
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
    create(user: {
        id: string;
    }, dto: CreateContentDto): Promise<{
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
    publish(id: string, user: {
        id: string;
    }): Promise<{
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
    getStream(id: string, user: {
        id: string;
    }): Promise<{
        streamUrl: string;
        title: string;
    }>;
}
