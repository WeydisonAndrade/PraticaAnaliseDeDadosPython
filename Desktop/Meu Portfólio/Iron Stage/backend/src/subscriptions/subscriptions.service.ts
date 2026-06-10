import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PaymentStatus,
  SubscriptionStatus,
  TransactionType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commissionService: CommissionService,
  ) {}

  findPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceCents: 'asc' },
    });
  }

  async getActiveSubscription(userId: string) {
    return this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
      include: { plan: true },
    });
  }

  async subscribe(userId: string, planSlug: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { slug: planSlug },
    });
    if (!plan || !plan.isActive) {
      throw new NotFoundException('Plano não encontrado');
    }

    const active = await this.getActiveSubscription(userId);
    if (active) {
      throw new BadRequestException('Usuário já possui assinatura ativa');
    }

    const split = this.commissionService.calculateSplit(
      plan.priceCents,
      TransactionType.SUBSCRIPTION,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.intervalDays);

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId,
          type: TransactionType.SUBSCRIPTION,
          status: PaymentStatus.COMPLETED,
          grossAmountCents: split.grossAmountCents,
          platformFeeCents: split.platformFeeCents,
          bandAmountCents: 0,
          paidAt: new Date(),
          metadata: { planSlug, planName: plan.name },
        },
      });

      const subscription = await tx.userSubscription.create({
        data: {
          userId,
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          expiresAt,
        },
        include: { plan: true },
      });

      return { subscription, payment, split };
    });
  }

  async cancel(userId: string) {
    const active = await this.getActiveSubscription(userId);
    if (!active) {
      throw new NotFoundException('Nenhuma assinatura ativa encontrada');
    }

    return this.prisma.userSubscription.update({
      where: { id: active.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });
  }
}
