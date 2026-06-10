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
exports.LiveShowsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const access_control_service_1 = require("../access-control/access-control.service");
const commission_service_1 = require("../commission/commission.service");
let LiveShowsService = class LiveShowsService {
    prisma;
    accessControl;
    commissionService;
    constructor(prisma, accessControl, commissionService) {
        this.prisma = prisma;
        this.accessControl = accessControl;
        this.commissionService = commissionService;
    }
    findUpcoming() {
        return this.prisma.liveShow.findMany({
            where: {
                status: { in: [client_1.LiveShowStatus.SCHEDULED, client_1.LiveShowStatus.LIVE] },
                scheduledAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
            include: { band: { select: { id: true, name: true, slug: true, imageUrl: true } } },
            orderBy: { scheduledAt: 'asc' },
        });
    }
    async create(userId, dto) {
        await this.accessControl.assertBandOwnership(dto.bandId, userId);
        await this.accessControl.assertBandCanPublish(dto.bandId);
        this.commissionService.validatePpvPrice(dto.priceCents);
        const scheduledAt = new Date(dto.scheduledAt);
        if (scheduledAt <= new Date()) {
            throw new common_1.BadRequestException('Show deve ser agendado no futuro');
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
    async purchaseTicket(userId, liveShowId) {
        const show = await this.prisma.liveShow.findUnique({
            where: { id: liveShowId },
            include: { band: true },
        });
        if (!show)
            throw new common_1.NotFoundException('Show não encontrado');
        if (show.status === client_1.LiveShowStatus.CANCELLED) {
            throw new common_1.BadRequestException('Show cancelado');
        }
        const existing = await this.prisma.ppvTicket.findUnique({
            where: { userId_liveShowId: { userId, liveShowId } },
        });
        if (existing) {
            throw new common_1.BadRequestException('Você já possui ingresso para este show');
        }
        const split = this.commissionService.calculateSplit(show.priceCents, client_1.TransactionType.PPV);
        const { accessFrom, accessUntil } = this.commissionService.calculatePpvAccessWindow(show.scheduledAt, show.endsAt);
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    userId,
                    type: client_1.TransactionType.PPV,
                    status: client_1.PaymentStatus.COMPLETED,
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
    async checkAccess(userId, liveShowId) {
        const canAccess = await this.accessControl.canAccessLiveShow(userId, liveShowId);
        return { canAccess };
    }
};
exports.LiveShowsService = LiveShowsService;
exports.LiveShowsService = LiveShowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        access_control_service_1.AccessControlService,
        commission_service_1.CommissionService])
], LiveShowsService);
//# sourceMappingURL=live-shows.service.js.map