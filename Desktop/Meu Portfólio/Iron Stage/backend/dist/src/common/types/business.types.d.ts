export interface RevenueSplit {
    grossAmountCents: number;
    platformFeeCents: number;
    bandAmountCents: number;
    platformFeePercent: number;
}
export interface BusinessRulesConfig {
    commissionPpvPercent: number;
    commissionMarketplacePercent: number;
    commissionSubscriptionPercent: number;
    minPayoutAmountCents: number;
    minPpvPriceCents: number;
    maxPpvPriceCents: number;
    ppvAccessHoursBefore: number;
    ppvAccessHoursAfter: number;
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
