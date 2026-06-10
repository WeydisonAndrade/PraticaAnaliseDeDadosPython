import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CreateContentDto } from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControl: AccessControlService,
  ) {}

  findPublished(bandId?: string) {
    return this.prisma.content.findMany({
      where: {
        isPublished: true,
        ...(bandId ? { bandId } : {}),
      },
      include: {
        band: { select: { id: true, name: true, slug: true, imageUrl: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateContentDto) {
    await this.accessControl.assertBandOwnership(dto.bandId, userId);
    await this.accessControl.assertBandCanPublish(dto.bandId);

    return this.prisma.content.create({ data: dto });
  }

  async publish(contentId: string, userId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) throw new NotFoundException('Conteúdo não encontrado');

    await this.accessControl.assertBandOwnership(content.bandId, userId);

    return this.prisma.content.update({
      where: { id: contentId },
      data: { isPublished: true, publishedAt: new Date() },
    });
  }

  async getStreamUrl(contentId: string, userId: string) {
    const canAccess = await this.accessControl.canAccessContent(
      userId,
      contentId,
    );
    if (!canAccess) {
      throw new ForbiddenException('Você não tem acesso a este conteúdo');
    }

    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      select: { streamUrl: true, title: true },
    });
    if (!content?.streamUrl) {
      throw new NotFoundException('Stream não disponível');
    }

    return { streamUrl: content.streamUrl, title: content.title };
  }
}
