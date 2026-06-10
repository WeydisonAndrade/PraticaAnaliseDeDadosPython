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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const access_control_service_1 = require("../access-control/access-control.service");
let ContentService = class ContentService {
    prisma;
    accessControl;
    constructor(prisma, accessControl) {
        this.prisma = prisma;
        this.accessControl = accessControl;
    }
    findPublished(bandId) {
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
    async create(userId, dto) {
        await this.accessControl.assertBandOwnership(dto.bandId, userId);
        await this.accessControl.assertBandCanPublish(dto.bandId);
        return this.prisma.content.create({ data: dto });
    }
    async publish(contentId, userId) {
        const content = await this.prisma.content.findUnique({
            where: { id: contentId },
        });
        if (!content)
            throw new common_1.NotFoundException('Conteúdo não encontrado');
        await this.accessControl.assertBandOwnership(content.bandId, userId);
        return this.prisma.content.update({
            where: { id: contentId },
            data: { isPublished: true, publishedAt: new Date() },
        });
    }
    async getStreamUrl(contentId, userId) {
        const canAccess = await this.accessControl.canAccessContent(userId, contentId);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Você não tem acesso a este conteúdo');
        }
        const content = await this.prisma.content.findUnique({
            where: { id: contentId },
            select: { streamUrl: true, title: true },
        });
        if (!content?.streamUrl) {
            throw new common_1.NotFoundException('Stream não disponível');
        }
        return { streamUrl: content.streamUrl, title: content.title };
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        access_control_service_1.AccessControlService])
], ContentService);
//# sourceMappingURL=content.service.js.map