import { ConfigService } from '@nestjs/config';
import { TransactionType } from '@prisma/client';
import { BusinessRulesConfig, RevenueSplit } from '../common/types/business.types';
export declare class CommissionService {
    private readonly configService;
    private readonly config;
    constructor(configService: ConfigService);
    getConfig(): BusinessRulesConfig;
    calculateSplit(grossAmountCents: number, type: TransactionType): RevenueSplit;
    validatePpvPrice(priceCents: number): void;
    calculatePpvAccessWindow(scheduledAt: Date, endsAt: Date | null): {
        accessFrom: Date;
        accessUntil: Date;
    };
    canRequestPayout(pendingEarningsCents: number): boolean;
}
