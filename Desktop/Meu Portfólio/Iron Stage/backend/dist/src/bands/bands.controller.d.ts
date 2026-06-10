import { BandStatus } from '@prisma/client';
import { BandsService } from './bands.service';
import { CreateBandDto, UpdateBandDto } from './dto/band.dto';
export declare class BandsController {
    private readonly bandsService;
    constructor(bandsService: BandsService);
    findAll(status?: BandStatus): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            contents: number;
            liveShows: number;
            followers: number;
        };
    } & {
        name: string;
        id: string;
        userId: string;
        slug: string;
        bio: string | null;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.BandStatus;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findTrending(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            contents: number;
            liveShows: number;
            followers: number;
        };
    } & {
        name: string;
        id: string;
        userId: string;
        slug: string;
        bio: string | null;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.BandStatus;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findFollowing(user: {
        id: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        band: {
            _count: {
                contents: number;
                liveShows: number;
            };
        } & {
            name: string;
            id: string;
            userId: string;
            slug: string;
            bio: string | null;
            imageUrl: string | null;
            status: import(".prisma/client").$Enums.BandStatus;
            verifiedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        bandId: string;
    })[]>;
    findBySlug(slug: string): Promise<{
        _count: {
            contents: number;
            liveShows: number;
            followers: number;
        };
    } & {
        name: string;
        id: string;
        userId: string;
        slug: string;
        bio: string | null;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.BandStatus;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(user: {
        id: string;
    }, dto: CreateBandDto): Promise<{
        name: string;
        id: string;
        userId: string;
        slug: string;
        bio: string | null;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.BandStatus;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, user: {
        id: string;
    }, dto: UpdateBandDto): Promise<{
        name: string;
        id: string;
        userId: string;
        slug: string;
        bio: string | null;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.BandStatus;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verify(id: string): Promise<{
        name: string;
        id: string;
        userId: string;
        slug: string;
        bio: string | null;
        imageUrl: string | null;
        status: import(".prisma/client").$Enums.BandStatus;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    follow(id: string, user: {
        id: string;
    }): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        bandId: string;
    }>;
    unfollow(id: string, user: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
}
