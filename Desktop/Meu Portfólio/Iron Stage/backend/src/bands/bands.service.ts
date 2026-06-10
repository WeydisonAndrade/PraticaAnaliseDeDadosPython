import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BandStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBandDto, UpdateBandDto } from './dto/band.dto';

@Injectable()
export class BandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBandDto) {
    const existingBand = await this.prisma.band.findUnique({
      where: { userId },
    });
    if (existingBand) {
      throw new ConflictException('Usuário já possui uma banda cadastrada');
    }

    const slugTaken = await this.prisma.band.findUnique({
      where: { slug: dto.slug },
    });
    if (slugTaken) {
      throw new ConflictException('Slug já está em uso');
    }

    const [band] = await this.prisma.$transaction([
      this.prisma.band.create({
        data: { userId, ...dto, status: BandStatus.PENDING },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.BAND },
      }),
    ]);

    return band;
  }

  findAll(status?: BandStatus) {
    return this.prisma.band.findMany({
      where: status ? { status } : undefined,
      include: {
        _count: { select: { followers: true, contents: true, liveShows: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  findTrending(limit = 10) {
    return this.prisma.band.findMany({
      where: { status: BandStatus.VERIFIED },
      include: {
        _count: { select: { followers: true, contents: true, liveShows: true } },
      },
      orderBy: { followers: { _count: 'desc' } },
      take: limit,
    });
  }

  findFollowing(userId: string) {
    return this.prisma.bandFollow.findMany({
      where: { userId },
      include: {
        band: {
          include: {
            _count: { select: { contents: true, liveShows: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const band = await this.prisma.band.findUnique({
      where: { slug },
      include: {
        _count: { select: { followers: true, contents: true, liveShows: true } },
      },
    });
    if (!band) throw new NotFoundException('Banda não encontrada');
    return band;
  }

  async update(bandId: string, userId: string, dto: UpdateBandDto) {
    await this.assertOwnership(bandId, userId);
    return this.prisma.band.update({ where: { id: bandId }, data: dto });
  }

  async verify(bandId: string) {
    const band = await this.prisma.band.findUnique({ where: { id: bandId } });
    if (!band) throw new NotFoundException('Banda não encontrada');

    return this.prisma.band.update({
      where: { id: bandId },
      data: { status: BandStatus.VERIFIED, verifiedAt: new Date() },
    });
  }

  async follow(userId: string, bandId: string) {
    const band = await this.prisma.band.findUnique({ where: { id: bandId } });
    if (!band) throw new NotFoundException('Banda não encontrada');

    return this.prisma.bandFollow.upsert({
      where: { userId_bandId: { userId, bandId } },
      create: { userId, bandId },
      update: {},
    });
  }

  async unfollow(userId: string, bandId: string) {
    await this.prisma.bandFollow.deleteMany({ where: { userId, bandId } });
    return { success: true };
  }

  private async assertOwnership(bandId: string, userId: string) {
    const band = await this.prisma.band.findUnique({ where: { id: bandId } });
    if (!band || band.userId !== userId) {
      throw new ForbiddenException('Você não gerencia esta banda');
    }
  }
}
