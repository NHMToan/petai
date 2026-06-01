import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import type { Response } from "express";
import { Public } from "../auth/decorators/public.decorator";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("admin/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}

@Controller()
export class CurrentUserController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Get("me")
  me(@CurrentUser() user: JwtPayload) {
    return this.usersService.findCurrentUser(user.sub);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Patch("me")
  updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user, dto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Patch("me/password")
  changePassword(@CurrentUser() user: JwtPayload, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user, dto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post("me/image")
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(@CurrentUser() user: JwtPayload, @UploadedFile() file: UploadedImageFile) {
    return this.usersService.uploadCurrentUserImage(user, file);
  }

  @Public()
  @Get("users/:id/image")
  async userImage(@Param("id") id: string, @Res() response: Response) {
    const image = await this.usersService.getUserImage(id);
    response.setHeader("Content-Type", image.contentType);
    response.setHeader("Content-Length", image.buffer.length);
    response.send(image.buffer);
  }
}
