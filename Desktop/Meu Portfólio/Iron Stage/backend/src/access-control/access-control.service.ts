import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  AccessLevel,
  BandStatus,
  LiveShowStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async assertBandCanPublish(bandId: string): Promise<void> {
    const band = await this.prisma.band.findUnique({ where: { id: bandId } });
    if (!band) throw new NotFoundException('Banda não encontrada');
    if (band.status !== BandStatus.VERIFIED) {
      throw new ForbiddenException(
        'Banda precisa estar verificada para publicar conteúdo ou vender',
      );
    }
  }

  async assertBandOwnership(bandId: string, userId: string): Promise<void> {
    const band = await this.prisma.band.findUnique({ where: { id: bandId } });
    if (!band || band.userId !== userId) {
      throw new ForbiddenException('Você não gerencia esta banda');
    }
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
    });
    return !!subscription;
  }

  async canAccessContent(userId: string, contentId: string): Promise<boolean> {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content || !content.isPublished) return false;

    switch (content.accessLevel) {
      case AccessLevel.FREE:
        return true;
      case AccessLevel.SUBSCRIPTION:
        return this.hasActiveSubscription(userId);
      case AccessLevel.PURCHASE: {
        const access = await this.prisma.contentAccess.findUnique({
          where: { userId_contentId: { userId, contentId } },
        });
        if (!access) return false;
        if (access.expiresAt && access.expiresAt < new Date()) return false;
        return true;
      }
      default:
        return false;
    }
  }

  async canAccessLiveShow(userId: string, liveShowId: string): Promise<boolean> {
    const show = await this.prisma.liveShow.findUnique({
      where: { id: liveShowId },
    });
    if (!show) return false;
    if (show.status === LiveShowStatus.CANCELLED) return false;

    const ticket = await this.prisma.ppvTicket.findUnique({
      where: { userId_liveShowId: { userId, liveShowId } },
    });
    if (!ticket) return false;

    const now = new Date();
    return now >= ticket.accessFrom && now <= ticket.accessUntil;
  }
}
