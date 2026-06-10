import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionType } from '@prisma/client';
import {
  BusinessRulesConfig,
  RevenueSplit,
} from '../common/types/business.types';
import { CommissionCalculator } from '../common/utils/commission.calculator';

@Injectable()
export class CommissionService {
  private readonly config: BusinessRulesConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      commissionPpvPercent: this.configService.get<number>(
        'COMMISSION_PPV_PERCENT',
        20,
      ),
      commissionMarketplacePercent: this.configService.get<number>(
        'COMMISSION_MARKETPLACE_PERCENT',
        15,
      ),
      commissionSubscriptionPercent: this.configService.get<number>(
        'COMMISSION_SUBSCRIPTION_PERCENT',
        30,
      ),
      minPayoutAmountCents: this.configService.get<number>(
        'MIN_PAYOUT_AMOUNT_CENTS',
        5000,
      ),
      minPpvPriceCents: this.configService.get<number>(
        'MIN_PPV_PRICE_CENTS',
        1000,
      ),
      maxPpvPriceCents: this.configService.get<number>(
        'MAX_PPV_PRICE_CENTS',
        50000,
      ),
      ppvAccessHoursBefore: this.configService.get<number>(
        'PPV_ACCESS_HOURS_BEFORE',
        1,
      ),
      ppvAccessHoursAfter: this.configService.get<number>(
        'PPV_ACCESS_HOURS_AFTER',
        24,
      ),
    };
  }

  getConfig(): BusinessRulesConfig {
    return { ...this.config };
  }

  calculateSplit(
    grossAmountCents: number,
    type: TransactionType,
  ): RevenueSplit {
    return CommissionCalculator.calculateSplit(
      grossAmountCents,
      type,
      this.config,
    );
  }

  validatePpvPrice(priceCents: number): void {
    CommissionCalculator.validatePpvPrice(priceCents, this.config);
  }

  calculatePpvAccessWindow(
    scheduledAt: Date,
    endsAt: Date | null,
  ): { accessFrom: Date; accessUntil: Date } {
    return CommissionCalculator.calculatePpvAccessWindow(
      scheduledAt,
      endsAt,
      this.config,
    );
  }

  canRequestPayout(pendingEarningsCents: number): boolean {
    return pendingEarningsCents >= this.config.minPayoutAmountCents;
  }
}
