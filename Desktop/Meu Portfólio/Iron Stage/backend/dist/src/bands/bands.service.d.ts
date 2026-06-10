import { BandStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBandDto, UpdateBandDto } from './dto/band.dto';
export declare class BandsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBandDto): Promise<{
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
    findTrending(limit?: number): import(".prisma/client").Prisma.PrismaPromise<({
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
    findFollowing(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    update(bandId: string, userId: string, dto: UpdateBandDto): Promise<{
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
    verify(bandId: string): Promise<{
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
    follow(userId: string, bandId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        bandId: string;
    }>;
    unfollow(userId: string, bandId: string): Promise<{
        success: boolean;
    }>;
    private assertOwnership;
}
