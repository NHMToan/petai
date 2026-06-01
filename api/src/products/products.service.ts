import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  findAllPublic() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOnePublic(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  findAllAdmin() {
    return this.findAllPublic();
  }

  async getProductImage(idOrSlug: string) {
    const product = await this.findOnePublic(idOrSlug);
    if (!product.imageKey) {
      throw new NotFoundException("Product image is not stored on S3");
    }
    return this.storageService.getObject(product.imageKey);
  }

  async create(dto: CreateProductDto) {
    const data = this.toCreateData(dto);
    try {
      return await this.prisma.product.create({
        data,
      });
    } catch (error) {
      this.handlePrismaWriteError(error);
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureExists(id);
    const data = this.toUpdateData(dto);
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handlePrismaWriteError(error);
    }
  }

  async remove(id: string) {
    const product = await this.ensureExists(id);
    await this.prisma.product.delete({
      where: { id },
    });
    if (product.imageKey) {
      await this.storageService.deleteObject(product.imageKey);
    }
    return { success: true };
  }

  async uploadImage(id: string, file?: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException("No image file was uploaded");
    }
    const product = await this.ensureExists(id);
    const uploaded = await this.storageService.uploadProductImage(file, id);
    if (product.imageKey) {
      await this.storageService.deleteObject(product.imageKey);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        heroImage: uploaded.url,
        imageKey: uploaded.key,
        gallery: [uploaded.url, ...this.asStringArray(product.gallery).filter((entry) => entry !== uploaded.url)].slice(0, 6),
      },
    });
  }

  private async ensureExists(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  private asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  private handlePrismaWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta?.target.join(", ")
          : String(error.meta?.target ?? "unique field");
        throw new BadRequestException(`Duplicate value for: ${target}`);
      }
    }
    throw error;
  }

  private toCreateData(dto: CreateProductDto): Prisma.ProductCreateInput {
    return {
      name: dto.name,
      slug: dto.slug,
      tagline: dto.tagline,
      shortDescription: dto.shortDescription,
      description: dto.description,
      longDescription: dto.longDescription,
      price: dto.price,
      heroImage: dto.heroImage,
      category: dto.category,
      badge: dto.badge,
      imageKey: dto.imageKey,
      gallery: dto.gallery as Prisma.InputJsonValue,
      specs: dto.specs as unknown as Prisma.InputJsonValue,
    };
  }

  private toUpdateData(dto: UpdateProductDto): Prisma.ProductUpdateInput {
    const data: Prisma.ProductUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.tagline !== undefined) data.tagline = dto.tagline;
    if (dto.shortDescription !== undefined) data.shortDescription = dto.shortDescription;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.longDescription !== undefined) data.longDescription = dto.longDescription;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.heroImage !== undefined) data.heroImage = dto.heroImage;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.badge !== undefined) data.badge = dto.badge;
    if (dto.imageKey !== undefined) data.imageKey = dto.imageKey;
    if (dto.gallery !== undefined) data.gallery = dto.gallery as Prisma.InputJsonValue;
    if (dto.specs !== undefined) data.specs = dto.specs as unknown as Prisma.InputJsonValue;
    return data;
  }
}
