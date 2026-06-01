import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Role } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import { ClaimDeviceDto } from "./dto/claim-device.dto";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { UpdateDeviceDto } from "./dto/update-device.dto";
import { DevicesService } from "./devices.service";

@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Post("devices/claim")
  claim(@CurrentUser() user: JwtPayload, @Body() dto: ClaimDeviceDto) {
    return this.devicesService.claimDevice(user, dto);
  }

  @Roles(Role.ADMIN)
  @Get("admin/devices")
  findAll() {
    return this.devicesService.findAllAdmin();
  }

  @Roles(Role.ADMIN)
  @Post("admin/devices")
  create(@Body() dto: CreateDeviceDto) {
    return this.devicesService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch("admin/devices/:id")
  update(@Param("id") id: string, @Body() dto: UpdateDeviceDto) {
    return this.devicesService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete("admin/devices/:id")
  remove(@Param("id") id: string) {
    return this.devicesService.remove(id);
  }
}
