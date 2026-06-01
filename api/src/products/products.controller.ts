import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import type { Response } from "express";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get("shop/products")
  findAllPublic() {
    return this.productsService.findAllPublic();
  }

  @Public()
  @Get("shop/products/:idOrSlug")
  findOnePublic(@Param("idOrSlug") idOrSlug: string) {
    return this.productsService.findOnePublic(idOrSlug);
  }

  @Public()
  @Get("shop/products/:idOrSlug/image")
  async productImage(@Param("idOrSlug") idOrSlug: string, @Res() response: Response) {
    const image = await this.productsService.getProductImage(idOrSlug);
    response.setHeader("Content-Type", image.contentType);
    response.setHeader("Content-Length", image.buffer.length);
    response.send(image.buffer);
  }

  @Roles(Role.ADMIN)
  @Get("admin/products")
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }

  @Roles(Role.ADMIN)
  @Post("admin/products")
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch("admin/products/:id")
  update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete("admin/products/:id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }

  @Roles(Role.ADMIN)
  @Post("admin/products/:id/image")
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(@Param("id") id: string, @UploadedFile() file: UploadedImageFile) {
    return this.productsService.uploadImage(id, file);
  }
}
