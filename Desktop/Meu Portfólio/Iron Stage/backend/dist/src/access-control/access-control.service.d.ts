import { PrismaService } from '../prisma/prisma.service';
export declare class AccessControlService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertBandCanPublish(bandId: string): Promise<void>;
    assertBandOwnership(bandId: string, userId: string): Promise<void>;
    hasActiveSubscription(userId: string): Promise<boolean>;
    canAccessContent(userId: string, contentId: string): Promise<boolean>;
    canAccessLiveShow(userId: string, liveShowId: string): Promise<boolean>;
}
