export declare class CreateLiveShowDto {
    bandId: string;
    title: string;
    description?: string;
    scheduledAt: string;
    endsAt?: string;
    priceCents: number;
    thumbnailUrl?: string;
}
export declare class PurchasePpvDto {
    liveShowId: string;
}
