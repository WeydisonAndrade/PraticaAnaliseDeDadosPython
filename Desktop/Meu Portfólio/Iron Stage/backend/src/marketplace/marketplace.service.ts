import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, PaymentStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CommissionService } from '../commission/commission.service';
import { CreateOrderDto, CreateProductDto } from './dto/marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControl: AccessControlService,
    private readonly commissionService: CommissionService,
  ) {}

  findProducts(bandId?: string) {
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

  async createProduct(userId: string, dto: CreateProductDto) {
    await this.accessControl.assertBandOwnership(dto.bandId, userId);
    await this.accessControl.assertBandCanPublish(dto.bandId);

    return this.prisma.product.create({ data: dto });
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException('Pedido deve conter ao menos um item');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { band: true },
    });

    if (products.length !== dto.items.length) {
      throw new NotFoundException('Produto não encontrado ou indisponível');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalCents = 0;
    const orderItems: {
      productId: string;
      quantity: number;
      unitPriceCents: number;
      bandId: string;
    }[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) throw new NotFoundException('Produto não encontrado');
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para ${product.name}`,
        );
      }
      if (product.band.status !== 'VERIFIED') {
        throw new BadRequestException(
          `Banda ${product.band.name} não está verificada para vender`,
        );
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
      const bandGroups = new Map<string, number>();

      for (const item of orderItems) {
        const lineTotal = item.unitPriceCents * item.quantity;
        bandGroups.set(
          item.bandId,
          (bandGroups.get(item.bandId) ?? 0) + lineTotal,
        );
      }

      for (const [bandId, bandTotal] of bandGroups) {
        const split = this.commissionService.calculateSplit(
          bandTotal,
          TransactionType.MARKETPLACE,
        );

        const payment = await tx.payment.create({
          data: {
            userId,
            orderId: order.id,
            type: TransactionType.MARKETPLACE,
            status: PaymentStatus.COMPLETED,
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
        data: { status: OrderStatus.PAID },
      });

      return { order, payments };
    });
  }
}
