import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commissionService: CommissionService,
  ) {}

  getCommissionRules() {
    return this.commissionService.getConfig();
  }

  async getBandEarnings(bandId: string, userId: string) {
    const band = await this.prisma.band.findUnique({ where: { id: bandId } });
    if (!band || band.userId !== userId) {
      throw new NotFoundException('Banda não encontrada');
    }

    const earnings = await this.prisma.bandEarning.findMany({
      where: { bandId },
      include: {
        payment: {
          select: {
            type: true,
            grossAmountCents: true,
            platformFeeCents: true,
            paidAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingTotal = earnings
      .filter((e) => e.status === PayoutStatus.PENDING)
      .reduce((sum, e) => sum + e.amountCents, 0);

    return {
      earnings,
      pendingTotalCents: pendingTotal,
      canRequestPayout:
        this.commissionService.canRequestPayout(pendingTotal),
      minPayoutCents: this.commissionService.getConfig().minPayoutAmountCents,
    };
  }

  async requestPayout(bandId: string, userId: string) {
    const summary = await this.getBandEarnings(bandId, userId);
    if (!summary.canRequestPayout) {
      throw new BadRequestException(
        `Saldo mínimo para saque: R$ ${(summary.minPayoutCents / 100).toFixed(2)}`,
      );
    }

    await this.prisma.bandEarning.updateMany({
      where: { bandId, status: PayoutStatus.PENDING },
      data: { status: PayoutStatus.PROCESSING },
    });

    return {
      message: 'Solicitação de repasse registrada',
      amountCents: summary.pendingTotalCents,
      status: PayoutStatus.PROCESSING,
    };
  }
}
