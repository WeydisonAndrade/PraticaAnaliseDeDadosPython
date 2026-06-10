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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const commission_service_1 = require("../commission/commission.service");
let PaymentsService = class PaymentsService {
    prisma;
    commissionService;
    constructor(prisma, commissionService) {
        this.prisma = prisma;
        this.commissionService = commissionService;
    }
    getCommissionRules() {
        return this.commissionService.getConfig();
    }
    async getBandEarnings(bandId, userId) {
        const band = await this.prisma.band.findUnique({ where: { id: bandId } });
        if (!band || band.userId !== userId) {
            throw new common_1.NotFoundException('Banda não encontrada');
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
            .filter((e) => e.status === client_1.PayoutStatus.PENDING)
            .reduce((sum, e) => sum + e.amountCents, 0);
        return {
            earnings,
            pendingTotalCents: pendingTotal,
            canRequestPayout: this.commissionService.canRequestPayout(pendingTotal),
            minPayoutCents: this.commissionService.getConfig().minPayoutAmountCents,
        };
    }
    async requestPayout(bandId, userId) {
        const summary = await this.getBandEarnings(bandId, userId);
        if (!summary.canRequestPayout) {
            throw new common_1.BadRequestException(`Saldo mínimo para saque: R$ ${(summary.minPayoutCents / 100).toFixed(2)}`);
        }
        await this.prisma.bandEarning.updateMany({
            where: { bandId, status: client_1.PayoutStatus.PENDING },
            data: { status: client_1.PayoutStatus.PROCESSING },
        });
        return {
            message: 'Solicitação de repasse registrada',
            amountCents: summary.pendingTotalCents,
            status: client_1.PayoutStatus.PROCESSING,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        commission_service_1.CommissionService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map