import { TransactionType } from '@prisma/client';
import {
  BusinessRulesConfig,
  RevenueSplit,
} from '../types/business.types';

export class CommissionCalculator {
  static calculateSplit(
    grossAmountCents: number,
    type: TransactionType,
    config: BusinessRulesConfig,
  ): RevenueSplit {
    const percent = this.getCommissionPercent(type, config);
    const platformFeeCents = Math.round((grossAmountCents * percent) / 100);
    const bandAmountCents = grossAmountCents - platformFeeCents;

    return {
      grossAmountCents,
      platformFeeCents,
      bandAmountCents,
      platformFeePercent: percent,
    };
  }

  static getCommissionPercent(
    type: TransactionType,
    config: BusinessRulesConfig,
  ): number {
    switch (type) {
      case TransactionType.PPV:
        return config.commissionPpvPercent;
      case TransactionType.MARKETPLACE:
        return config.commissionMarketplacePercent;
      case TransactionType.SUBSCRIPTION:
        return config.commissionSubscriptionPercent;
      default:
        return 0;
    }
  }

  static validatePpvPrice(
    priceCents: number,
    config: BusinessRulesConfig,
  ): void {
    if (priceCents < config.minPpvPriceCents) {
      throw new Error(
        `Preço mínimo do PPV: R$ ${(config.minPpvPriceCents / 100).toFixed(2)}`,
      );
    }
    if (priceCents > config.maxPpvPriceCents) {
      throw new Error(
        `Preço máximo do PPV: R$ ${(config.maxPpvPriceCents / 100).toFixed(2)}`,
      );
    }
  }

  static calculatePpvAccessWindow(
    scheduledAt: Date,
    endsAt: Date | null,
    config: BusinessRulesConfig,
  ): { accessFrom: Date; accessUntil: Date } {
    const accessFrom = new Date(scheduledAt);
    accessFrom.setHours(
      accessFrom.getHours() - config.ppvAccessHoursBefore,
    );

    const accessUntil = endsAt ? new Date(endsAt) : new Date(scheduledAt);
    if (!endsAt) {
      accessUntil.setHours(accessUntil.getHours() + 3);
    }
    accessUntil.setHours(
      accessUntil.getHours() + config.ppvAccessHoursAfter,
    );

    return { accessFrom, accessUntil };
  }
}
