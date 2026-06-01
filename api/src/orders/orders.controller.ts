import { Body, Controller, Get, Post } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post("shop/orders")
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Get("admin/orders")
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }
}
