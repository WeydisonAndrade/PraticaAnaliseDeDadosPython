export declare class CreateBandDto {
    name: string;
    slug: string;
    bio?: string;
    imageUrl?: string;
}
export declare class UpdateBandDto {
    name?: string;
    bio?: string;
    imageUrl?: string;
}
export declare class VerifyBandDto {
    bandId: string;
}
export declare class FollowBandDto {
    bandId: string;
}
