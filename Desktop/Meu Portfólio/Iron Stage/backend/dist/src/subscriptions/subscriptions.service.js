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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const commission_service_1 = require("../commission/commission.service");
let SubscriptionsService = class SubscriptionsService {
    prisma;
    commissionService;
    constructor(prisma, commissionService) {
        this.prisma = prisma;
        this.commissionService = commissionService;
    }
    findPlans() {
        return this.prisma.subscriptionPlan.findMany({
            where: { isActive: true },
            orderBy: { priceCents: 'asc' },
        });
    }
    async getActiveSubscription(userId) {
        return this.prisma.userSubscription.findFirst({
            where: {
                userId,
                status: client_1.SubscriptionStatus.ACTIVE,
                expiresAt: { gt: new Date() },
            },
            include: { plan: true },
        });
    }
    async subscribe(userId, planSlug) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { slug: planSlug },
        });
        if (!plan || !plan.isActive) {
            throw new common_1.NotFoundException('Plano não encontrado');
        }
        const active = await this.getActiveSubscription(userId);
        if (active) {
            throw new common_1.BadRequestException('Usuário já possui assinatura ativa');
        }
        const split = this.commissionService.calculateSplit(plan.priceCents, client_1.TransactionType.SUBSCRIPTION);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + plan.intervalDays);
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    userId,
                    type: client_1.TransactionType.SUBSCRIPTION,
                    status: client_1.PaymentStatus.COMPLETED,
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
                    status: client_1.SubscriptionStatus.ACTIVE,
                    expiresAt,
                },
                include: { plan: true },
            });
            return { subscription, payment, split };
        });
    }
    async cancel(userId) {
        const active = await this.getActiveSubscription(userId);
        if (!active) {
            throw new common_1.NotFoundException('Nenhuma assinatura ativa encontrada');
        }
        return this.prisma.userSubscription.update({
            where: { id: active.id },
            data: {
                status: client_1.SubscriptionStatus.CANCELLED,
                cancelledAt: new Date(),
            },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        commission_service_1.CommissionService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map