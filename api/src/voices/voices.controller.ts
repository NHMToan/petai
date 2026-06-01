import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { Role } from "@prisma/client";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateVoiceDto } from "./dto/create-voice.dto";
import { UpdateVoiceDto } from "./dto/update-voice.dto";
import { VoicesService } from "./voices.service";

@Controller("voices")
export class PublicVoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Public()
  @Get()
  findActive() {
    return this.voicesService.findActive();
  }

  @Public()
  @Get(":id/preview")
  async preview(@Param("id") id: string, @Res() response: Response) {
    const preview = await this.voicesService.generatePreviewAudio(id);
    response.setHeader("Content-Type", preview.contentType);
    response.setHeader("Content-Length", preview.buffer.length);
    response.setHeader("Content-Disposition", `inline; filename="${preview.fileName}"`);
    response.setHeader("Cache-Control", "public, max-age=3600");
    response.send(preview.buffer);
  }
}

@Roles(Role.ADMIN)
@Controller("admin/voices")
export class VoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Get()
  findAll() {
    return this.voicesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateVoiceDto) {
    return this.voicesService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateVoiceDto) {
    return this.voicesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.voicesService.remove(id);
  }

  @Get(":id/preview")
  async preview(@Param("id") id: string, @Res() response: Response) {
    const preview = await this.voicesService.generatePreviewAudio(id, { allowInactive: true });
    response.setHeader("Content-Type", preview.contentType);
    response.setHeader("Content-Length", preview.buffer.length);
    response.setHeader("Content-Disposition", `inline; filename="${preview.fileName}"`);
    response.setHeader("Cache-Control", "no-store");
    response.send(preview.buffer);
  }
}
