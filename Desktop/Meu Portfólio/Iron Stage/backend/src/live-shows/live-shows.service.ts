import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LiveShowStatus, PaymentStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CommissionService } from '../commission/commission.service';
import { CreateLiveShowDto } from './dto/live-show.dto';

@Injectable()
export class LiveShowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControl: AccessControlService,
    private readonly commissionService: CommissionService,
  ) {}

  findUpcoming() {
    return this.prisma.liveShow.findMany({
      where: {
        status: { in: [LiveShowStatus.SCHEDULED, LiveShowStatus.LIVE] },
        scheduledAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      include: { band: { select: { id: true, name: true, slug: true, imageUrl: true } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateLiveShowDto) {
    await this.accessControl.assertBandOwnership(dto.bandId, userId);
    await this.accessControl.assertBandCanPublish(dto.bandId);
    this.commissionService.validatePpvPrice(dto.priceCents);

    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt <= new Date()) {
      throw new BadRequestException('Show deve ser agendado no futuro');
    }

    return this.prisma.liveShow.create({
      data: {
        bandId: dto.bandId,
        title: dto.title,
        description: dto.description,
        scheduledAt,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        priceCents: dto.priceCents,
        thumbnailUrl: dto.thumbnailUrl,
      },
      include: { band: true },
    });
  }

  async purchaseTicket(userId: string, liveShowId: string) {
    const show = await this.prisma.liveShow.findUnique({
      where: { id: liveShowId },
      include: { band: true },
    });
    if (!show) throw new NotFoundException('Show não encontrado');
    if (show.status === LiveShowStatus.CANCELLED) {
      throw new BadRequestException('Show cancelado');
    }

    const existing = await this.prisma.ppvTicket.findUnique({
      where: { userId_liveShowId: { userId, liveShowId } },
    });
    if (existing) {
      throw new BadRequestException('Você já possui ingresso para este show');
    }

    const split = this.commissionService.calculateSplit(
      show.priceCents,
      TransactionType.PPV,
    );
    const { accessFrom, accessUntil } =
      this.commissionService.calculatePpvAccessWindow(
        show.scheduledAt,
        show.endsAt,
      );

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId,
          type: TransactionType.PPV,
          status: PaymentStatus.COMPLETED,
          grossAmountCents: split.grossAmountCents,
          platformFeeCents: split.platformFeeCents,
          bandAmountCents: split.bandAmountCents,
          bandId: show.bandId,
          paidAt: new Date(),
          metadata: { liveShowId, showTitle: show.title },
        },
      });

      await tx.bandEarning.create({
        data: {
          bandId: show.bandId,
          paymentId: payment.id,
          amountCents: split.bandAmountCents,
        },
      });

      const ticket = await tx.ppvTicket.create({
        data: {
          userId,
          liveShowId,
          paymentId: payment.id,
          accessFrom,
          accessUntil,
        },
        include: { liveShow: { include: { band: true } } },
      });

      return { ticket, payment, split };
    });
  }

  async checkAccess(userId: string, liveShowId: string) {
    const canAccess = await this.accessControl.canAccessLiveShow(
      userId,
      liveShowId,
    );
    return { canAccess };
  }
}
