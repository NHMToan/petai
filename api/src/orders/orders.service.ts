import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderSource, OrderStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    const normalizedItems = dto.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const quantity = Math.max(1, Math.floor(item.quantity));
      const unitPrice = product.price;

      return {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        heroImage: product.heroImage,
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice,
      };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const total = subtotal;

    return this.prisma.order.create({
      data: {
        orderNumber: await this.generateOrderNumber(),
        status: OrderStatus.PENDING,
        source: dto.source ?? OrderSource.WEB,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        company: dto.company,
        shippingLine1: dto.shippingLine1,
        shippingLine2: dto.shippingLine2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: dto.country,
        note: dto.note,
        subtotal,
        total,
        items: {
          create: normalizedItems,
        },
      },
      include: {
        items: true,
      },
    });
  }

  findAllAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  private async generateOrderNumber() {
    const count = await this.prisma.order.count();
    return `PA-${String(count + 1).padStart(5, "0")}`;
  }
}
