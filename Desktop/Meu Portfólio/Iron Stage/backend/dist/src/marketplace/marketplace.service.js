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
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const access_control_service_1 = require("../access-control/access-control.service");
const commission_service_1 = require("../commission/commission.service");
let MarketplaceService = class MarketplaceService {
    prisma;
    accessControl;
    commissionService;
    constructor(prisma, accessControl, commissionService) {
        this.prisma = prisma;
        this.accessControl = accessControl;
        this.commissionService = commissionService;
    }
    findProducts(bandId) {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                ...(bandId ? { bandId } : {}),
                stock: { gt: 0 },
            },
            include: {
                band: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createProduct(userId, dto) {
        await this.accessControl.assertBandOwnership(dto.bandId, userId);
        await this.accessControl.assertBandCanPublish(dto.bandId);
        return this.prisma.product.create({ data: dto });
    }
    async createOrder(userId, dto) {
        if (!dto.items?.length) {
            throw new common_1.BadRequestException('Pedido deve conter ao menos um item');
        }
        const productIds = dto.items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
            include: { band: true },
        });
        if (products.length !== dto.items.length) {
            throw new common_1.NotFoundException('Produto não encontrado ou indisponível');
        }
        const productMap = new Map(products.map((p) => [p.id, p]));
        let totalCents = 0;
        const orderItems = [];
        for (const item of dto.items) {
            const product = productMap.get(item.productId);
            if (!product)
                throw new common_1.NotFoundException('Produto não encontrado');
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Estoque insuficiente para ${product.name}`);
            }
            if (product.band.status !== 'VERIFIED') {
                throw new common_1.BadRequestException(`Banda ${product.band.name} não está verificada para vender`);
            }
            totalCents += product.priceCents * item.quantity;
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                unitPriceCents: product.priceCents,
                bandId: product.bandId,
            });
        }
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalCents,
                    shippingAddress: dto.shippingAddress,
                    items: { create: orderItems },
                },
                include: { items: { include: { product: true } } },
            });
            for (const item of dto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            const payments = [];
            const bandGroups = new Map();
            for (const item of orderItems) {
                const lineTotal = item.unitPriceCents * item.quantity;
                bandGroups.set(item.bandId, (bandGroups.get(item.bandId) ?? 0) + lineTotal);
            }
            for (const [bandId, bandTotal] of bandGroups) {
                const split = this.commissionService.calculateSplit(bandTotal, client_1.TransactionType.MARKETPLACE);
                const payment = await tx.payment.create({
                    data: {
                        userId,
                        orderId: order.id,
                        type: client_1.TransactionType.MARKETPLACE,
                        status: client_1.PaymentStatus.COMPLETED,
                        grossAmountCents: split.grossAmountCents,
                        platformFeeCents: split.platformFeeCents,
                        bandAmountCents: split.bandAmountCents,
                        bandId,
                        paidAt: new Date(),
                        metadata: { orderId: order.id },
                    },
                });
                await tx.bandEarning.create({
                    data: {
                        bandId,
                        paymentId: payment.id,
                        amountCents: split.bandAmountCents,
                    },
                });
                payments.push({ payment, split });
            }
            await tx.order.update({
                where: { id: order.id },
                data: { status: client_1.OrderStatus.PAID },
            });
            return { order, payments };
        });
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        access_control_service_1.AccessControlService,
        commission_service_1.CommissionService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map