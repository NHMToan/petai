import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Role } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { CreateAdminPetDto } from "./dto/create-admin-pet.dto";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdateAdminPetDto } from "./dto/update-admin-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";
import { PetsService } from "./pets.service";

@Controller()
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Get("pets")
  findMine(@CurrentUser() user: JwtPayload) {
    return this.petsService.findMyPets(user.sub);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get("pets/:id")
  findMineById(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.petsService.findMyPetById(user, id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post("pets")
  createMine(@CurrentUser() user: JwtPayload, @Body() dto: CreatePetDto) {
    return this.petsService.createForUser(user, dto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Patch("pets/:id")
  updateMine(
    @CurrentUser() user: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdatePetDto,
  ) {
    return this.petsService.updateMyPet(user, id, dto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post("pets/:id/image")
  @UseInterceptors(FileInterceptor("file"))
  uploadMineImage(
    @CurrentUser() user: JwtPayload,
    @Param("id") id: string,
    @UploadedFile() file: UploadedImageFile,
  ) {
    return this.petsService.uploadPetImage(user, id, file);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete("pets/:id")
  removeMine(@CurrentUser() user: JwtPayload, @Param("id") id: string) {
    return this.petsService.removeMyPet(user, id);
  }

  @Roles(Role.ADMIN)
  @Get("admin/pets")
  findAllAdmin() {
    return this.petsService.findAllAdmin();
  }

  @Roles(Role.ADMIN)
  @Post("admin/pets")
  createAdmin(@Body() dto: CreateAdminPetDto) {
    return this.petsService.createAdmin(dto);
  }

  @Roles(Role.ADMIN)
  @Patch("admin/pets/:id")
  updateAdmin(@Param("id") id: string, @Body() dto: UpdateAdminPetDto) {
    return this.petsService.updateAdmin(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete("admin/pets/:id")
  removeAdmin(@Param("id") id: string) {
    return this.petsService.removeAdmin(id);
  }
}
