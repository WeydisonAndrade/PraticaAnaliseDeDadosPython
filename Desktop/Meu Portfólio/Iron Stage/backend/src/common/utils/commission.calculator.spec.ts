import { TransactionType } from '@prisma/client';
import { CommissionCalculator } from './commission.calculator';
import { BusinessRulesConfig } from '../types/business.types';

const config: BusinessRulesConfig = {
  commissionPpvPercent: 20,
  commissionMarketplacePercent: 15,
  commissionSubscriptionPercent: 30,
  minPayoutAmountCents: 5000,
  minPpvPriceCents: 1000,
  maxPpvPriceCents: 50000,
  ppvAccessHoursBefore: 1,
  ppvAccessHoursAfter: 24,
};

describe('CommissionCalculator', () => {
  it('calcula split PPV com 20% para plataforma', () => {
    const split = CommissionCalculator.calculateSplit(
      2500,
      TransactionType.PPV,
      config,
    );
    expect(split.platformFeeCents).toBe(500);
    expect(split.bandAmountCents).toBe(2000);
  });

  it('calcula split marketplace com 15% para plataforma', () => {
    const split = CommissionCalculator.calculateSplit(
      8990,
      TransactionType.MARKETPLACE,
      config,
    );
    expect(split.platformFeeCents).toBe(1349);
    expect(split.bandAmountCents).toBe(7641);
  });

  it('rejeita preço PPV abaixo do mínimo', () => {
    expect(() =>
      CommissionCalculator.validatePpvPrice(500, config),
    ).toThrow();
  });

  it('calcula janela de acesso PPV', () => {
    const scheduledAt = new Date('2024-06-01T21:00:00Z');
    const { accessFrom, accessUntil } =
      CommissionCalculator.calculatePpvAccessWindow(scheduledAt, null, config);

    expect(accessFrom.getHours()).toBe(scheduledAt.getHours() - 1);
    expect(accessUntil.getTime()).toBeGreaterThan(scheduledAt.getTime());
  });
});
