"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const IMG = {
    concert: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=340&fit=crop',
    guitar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=340&fit=crop',
    crowd: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=340&fit=crop',
    stage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=340&fit=crop',
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=450&fit=crop',
    shirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    vinyl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=200&h=200&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
};
async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const fanPassword = await bcrypt.hash('fan123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ironstage.com' },
        update: {},
        create: {
            email: 'admin@ironstage.com',
            passwordHash,
            name: 'Admin Iron Stage',
            role: client_1.UserRole.ADMIN,
        },
    });
    const fan = await prisma.user.upsert({
        where: { email: 'fan@ironstage.com' },
        update: { avatarUrl: IMG.avatar },
        create: {
            email: 'fan@ironstage.com',
            passwordHash: fanPassword,
            name: 'Headbanger',
            role: client_1.UserRole.FAN,
            avatarUrl: IMG.avatar,
        },
    });
    const premiumPlan = await prisma.subscriptionPlan.upsert({
        where: { slug: 'iron-premium' },
        update: {},
        create: {
            name: 'Iron Premium',
            slug: 'iron-premium',
            description: 'Acesso ilimitado ao catálogo de rock e metal',
            priceCents: 2990,
            intervalDays: 30,
            features: [
                'Catálogo completo',
                'Conteúdo exclusivo',
                'Descontos na loja',
                'Qualidade HD',
            ],
        },
    });
    await prisma.subscriptionPlan.upsert({
        where: { slug: 'iron-basic' },
        update: {},
        create: {
            name: 'Iron Basic',
            slug: 'iron-basic',
            description: 'Acesso ao catálogo essencial',
            priceCents: 1490,
            intervalDays: 30,
            features: ['Catálogo básico', 'Qualidade SD'],
        },
    });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await prisma.userSubscription.deleteMany({ where: { userId: fan.id } });
    await prisma.userSubscription.create({
        data: {
            userId: fan.id,
            planId: premiumPlan.id,
            status: client_1.SubscriptionStatus.ACTIVE,
            expiresAt,
        },
    });
    const bandData = [
        {
            email: 'sepultura@ironstage.com',
            name: 'Sepultura',
            slug: 'sepultura',
            imageUrl: IMG.concert,
        },
        {
            email: 'angra@ironstage.com',
            name: 'Angra',
            slug: 'angra',
            imageUrl: IMG.poster,
        },
        {
            email: 'krisiun@ironstage.com',
            name: 'Krisiun',
            slug: 'krisiun',
            imageUrl: IMG.crowd,
        },
        {
            email: 'nervosa@ironstage.com',
            name: 'Nervosa',
            slug: 'nervosa',
            imageUrl: IMG.stage,
        },
    ];
    const bands = [];
    for (const b of bandData) {
        const user = await prisma.user.upsert({
            where: { email: b.email },
            update: {},
            create: {
                email: b.email,
                passwordHash: await bcrypt.hash('band123', 10),
                name: b.name,
                role: client_1.UserRole.BAND,
            },
        });
        const band = await prisma.band.upsert({
            where: { slug: b.slug },
            update: {
                status: client_1.BandStatus.VERIFIED,
                verifiedAt: new Date(),
                imageUrl: b.imageUrl,
            },
            create: {
                userId: user.id,
                name: b.name,
                slug: b.slug,
                imageUrl: b.imageUrl,
                status: client_1.BandStatus.VERIFIED,
                verifiedAt: new Date(),
                bio: `${b.name} — rock e metal brasileiro no Iron Stage`,
            },
        });
        bands.push(band);
    }
    const [sepultura, angra, krisiun, nervosa] = bands;
    await prisma.content.deleteMany({});
    await prisma.content.createMany({
        data: [
            {
                bandId: sepultura.id,
                title: 'Sepultura - História, Luta e Som',
                description: 'Documentário oficial',
                type: client_1.ContentType.DOCUMENTARY,
                accessLevel: client_1.AccessLevel.SUBSCRIPTION,
                durationMin: 95,
                thumbnailUrl: IMG.stage,
                isPublished: true,
                publishedAt: new Date('2024-03-01'),
            },
            {
                bandId: angra.id,
                title: 'Temple of Shadows',
                description: 'Show completo',
                type: client_1.ContentType.SHOW,
                accessLevel: client_1.AccessLevel.SUBSCRIPTION,
                durationMin: 85,
                thumbnailUrl: IMG.poster,
                isPublished: true,
                publishedAt: new Date('2024-01-15'),
            },
            {
                bandId: krisiun.id,
                title: 'Krisiun - Show Completo',
                description: 'Gravação inédita',
                type: client_1.ContentType.LIVE_RECORDING,
                accessLevel: client_1.AccessLevel.SUBSCRIPTION,
                durationMin: 78,
                thumbnailUrl: IMG.crowd,
                isPublished: true,
                publishedAt: new Date('2024-05-10'),
            },
            {
                bandId: nervosa.id,
                title: 'Project46 - Bastidores',
                description: 'Conteúdo exclusivo',
                type: client_1.ContentType.EXCLUSIVE,
                accessLevel: client_1.AccessLevel.SUBSCRIPTION,
                durationMin: 45,
                thumbnailUrl: IMG.guitar,
                isPublished: true,
                publishedAt: new Date('2024-04-20'),
            },
        ],
    });
    await prisma.liveShow.deleteMany({});
    const showDate = new Date();
    showDate.setDate(showDate.getDate() + 7);
    showDate.setHours(21, 0, 0, 0);
    const showDate2 = new Date(showDate);
    showDate2.setDate(showDate2.getDate() + 8);
    showDate2.setHours(20, 30, 0, 0);
    await prisma.liveShow.createMany({
        data: [
            {
                bandId: sepultura.id,
                title: 'Fúria Metal Fest 2024',
                description: 'Transmissão ao vivo',
                scheduledAt: showDate,
                priceCents: 2500,
                status: client_1.LiveShowStatus.SCHEDULED,
                thumbnailUrl: IMG.concert,
            },
            {
                bandId: angra.id,
                title: 'Angra Live Session',
                scheduledAt: showDate2,
                priceCents: 3500,
                status: client_1.LiveShowStatus.SCHEDULED,
                thumbnailUrl: IMG.poster,
            },
            {
                bandId: krisiun.id,
                title: 'Krisiun - Inferno Tour',
                scheduledAt: new Date(showDate2.getTime() + 7 * 86400000),
                priceCents: 2000,
                status: client_1.LiveShowStatus.SCHEDULED,
                thumbnailUrl: IMG.crowd,
            },
            {
                bandId: nervosa.id,
                title: 'Nervosa - Punishment Tour',
                scheduledAt: new Date(showDate2.getTime() + 14 * 86400000),
                priceCents: 2200,
                status: client_1.LiveShowStatus.SCHEDULED,
                thumbnailUrl: IMG.stage,
            },
        ],
    });
    await prisma.product.deleteMany({});
    await prisma.product.createMany({
        data: [
            {
                bandId: sepultura.id,
                name: 'Camiseta Oficial',
                type: client_1.ProductType.TSHIRT,
                priceCents: 8990,
                stock: 50,
                imageUrl: IMG.shirt,
            },
            {
                bandId: angra.id,
                name: 'Vinil Autografado',
                type: client_1.ProductType.VINYL,
                priceCents: 12990,
                stock: 20,
                imageUrl: IMG.vinyl,
            },
            {
                bandId: krisiun.id,
                name: 'Pôster Assinado',
                type: client_1.ProductType.POSTER,
                priceCents: 7990,
                stock: 30,
                imageUrl: IMG.poster,
            },
            {
                bandId: nervosa.id,
                name: 'CD Edição Limitada',
                type: client_1.ProductType.CD,
                priceCents: 3990,
                stock: 100,
                imageUrl: IMG.vinyl,
            },
        ],
    });
    await prisma.bandFollow.deleteMany({ where: { userId: fan.id } });
    for (const band of bands.slice(0, 3)) {
        await prisma.bandFollow.create({
            data: { userId: fan.id, bandId: band.id },
        });
    }
    console.log('Seed concluído!');
    console.log('Admin: admin@ironstage.com / admin123');
    console.log('Fã:    fan@ironstage.com / fan123');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map