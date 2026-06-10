"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let BandsService = class BandsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const existingBand = await this.prisma.band.findUnique({
            where: { userId },
        });
        if (existingBand) {
            throw new common_1.ConflictException('Usuário já possui uma banda cadastrada');
        }
        const slugTaken = await this.prisma.band.findUnique({
            where: { slug: dto.slug },
        });
        if (slugTaken) {
            throw new common_1.ConflictException('Slug já está em uso');
        }
        const [band] = await this.prisma.$transaction([
            this.prisma.band.create({
                data: { userId, ...dto, status: client_1.BandStatus.PENDING },
            }),
            this.prisma.user.update({
                where: { id: userId },
                data: { role: client_1.UserRole.BAND },
            }),
        ]);
        return band;
    }
    findAll(status) {
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
            where: { status: client_1.BandStatus.VERIFIED },
            include: {
                _count: { select: { followers: true, contents: true, liveShows: true } },
            },
            orderBy: { followers: { _count: 'desc' } },
            take: limit,
        });
    }
    findFollowing(userId) {
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
    async findBySlug(slug) {
        const band = await this.prisma.band.findUnique({
            where: { slug },
            include: {
                _count: { select: { followers: true, contents: true, liveShows: true } },
            },
        });
        if (!band)
            throw new common_1.NotFoundException('Banda não encontrada');
        return band;
    }
    async update(bandId, userId, dto) {
        await this.assertOwnership(bandId, userId);
        return this.prisma.band.update({ where: { id: bandId }, data: dto });
    }
    async verify(bandId) {
        const band = await this.prisma.band.findUnique({ where: { id: bandId } });
        if (!band)
            throw new common_1.NotFoundException('Banda não encontrada');
        return this.prisma.band.update({
            where: { id: bandId },
            data: { status: client_1.BandStatus.VERIFIED, verifiedAt: new Date() },
        });
    }
    async follow(userId, bandId) {
        const band = await this.prisma.band.findUnique({ where: { id: bandId } });
        if (!band)
            throw new common_1.NotFoundException('Banda não encontrada');
        return this.prisma.bandFollow.upsert({
            where: { userId_bandId: { userId, bandId } },
            create: { userId, bandId },
            update: {},
        });
    }
    async unfollow(userId, bandId) {
        await this.prisma.bandFollow.deleteMany({ where: { userId, bandId } });
        return { success: true };
    }
    async assertOwnership(bandId, userId) {
        const band = await this.prisma.band.findUnique({ where: { id: bandId } });
        if (!band || band.userId !== userId) {
            throw new common_1.ForbiddenException('Você não gerencia esta banda');
        }
    }
};
exports.BandsService = BandsService;
exports.BandsService = BandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BandsService);
//# sourceMappingURL=bands.service.js.map