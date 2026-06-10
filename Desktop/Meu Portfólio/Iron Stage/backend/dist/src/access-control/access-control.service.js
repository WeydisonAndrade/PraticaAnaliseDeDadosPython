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
exports.AccessControlService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AccessControlService = class AccessControlService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertBandCanPublish(bandId) {
        const band = await this.prisma.band.findUnique({ where: { id: bandId } });
        if (!band)
            throw new common_1.NotFoundException('Banda não encontrada');
        if (band.status !== client_1.BandStatus.VERIFIED) {
            throw new common_1.ForbiddenException('Banda precisa estar verificada para publicar conteúdo ou vender');
        }
    }
    async assertBandOwnership(bandId, userId) {
        const band = await this.prisma.band.findUnique({ where: { id: bandId } });
        if (!band || band.userId !== userId) {
            throw new common_1.ForbiddenException('Você não gerencia esta banda');
        }
    }
    async hasActiveSubscription(userId) {
        const subscription = await this.prisma.userSubscription.findFirst({
            where: {
                userId,
                status: client_1.SubscriptionStatus.ACTIVE,
                expiresAt: { gt: new Date() },
            },
        });
        return !!subscription;
    }
    async canAccessContent(userId, contentId) {
        const content = await this.prisma.content.findUnique({
            where: { id: contentId },
        });
        if (!content || !content.isPublished)
            return false;
        switch (content.accessLevel) {
            case client_1.AccessLevel.FREE:
                return true;
            case client_1.AccessLevel.SUBSCRIPTION:
                return this.hasActiveSubscription(userId);
            case client_1.AccessLevel.PURCHASE: {
                const access = await this.prisma.contentAccess.findUnique({
                    where: { userId_contentId: { userId, contentId } },
                });
                if (!access)
                    return false;
                if (access.expiresAt && access.expiresAt < new Date())
                    return false;
                return true;
            }
            default:
                return false;
        }
    }
    async canAccessLiveShow(userId, liveShowId) {
        const show = await this.prisma.liveShow.findUnique({
            where: { id: liveShowId },
        });
        if (!show)
            return false;
        if (show.status === client_1.LiveShowStatus.CANCELLED)
            return false;
        const ticket = await this.prisma.ppvTicket.findUnique({
            where: { userId_liveShowId: { userId, liveShowId } },
        });
        if (!ticket)
            return false;
        const now = new Date();
        return now >= ticket.accessFrom && now <= ticket.accessUntil;
    }
};
exports.AccessControlService = AccessControlService;
exports.AccessControlService = AccessControlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessControlService);
//# sourceMappingURL=access-control.service.js.map