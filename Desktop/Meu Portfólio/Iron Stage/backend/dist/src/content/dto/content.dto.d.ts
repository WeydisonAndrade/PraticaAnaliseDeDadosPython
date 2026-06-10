import { AccessLevel, ContentType } from '@prisma/client';
export declare class CreateContentDto {
    bandId: string;
    title: string;
    description?: string;
    type: ContentType;
    accessLevel?: AccessLevel;
    durationMin?: number;
    thumbnailUrl?: string;
    streamUrl?: string;
    priceCents?: number;
}
export declare class PublishContentDto {
    contentId: string;
}
