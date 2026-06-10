import { TransactionType } from '@prisma/client';
import { BusinessRulesConfig, RevenueSplit } from '../types/business.types';
export declare class CommissionCalculator {
    static calculateSplit(grossAmountCents: number, type: TransactionType, config: BusinessRulesConfig): RevenueSplit;
    static getCommissionPercent(type: TransactionType, config: BusinessRulesConfig): number;
    static validatePpvPrice(priceCents: number, config: BusinessRulesConfig): void;
    static calculatePpvAccessWindow(scheduledAt: Date, endsAt: Date | null, config: BusinessRulesConfig): {
        accessFrom: Date;
        accessUntil: Date;
    };
}
