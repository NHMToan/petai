import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            pets: true,
            devices: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new BadRequestException("Email is already in use");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email,
        name: dto.name,
        role: dto.role,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureExists(id);

    const data: Record<string, unknown> = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email.toLowerCase();
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async findCurrentUser(userId: string) {
    return this.findById(userId);
  }

  async updateProfile(user: JwtPayload, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: user.sub },
      data: {
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(user: JwtPayload, dto: ChangePasswordDto) {
    const current = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!current) {
      throw new NotFoundException("User not found");
    }

    const matches = await bcrypt.compare(dto.currentPassword, current.passwordHash);
    if (!matches) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException("New password must be different from the current password");
    }

    await this.prisma.user.update({
      where: { id: user.sub },
      data: {
        passwordHash: await bcrypt.hash(dto.newPassword, 10),
      },
    });

    return { success: true };
  }

  async uploadCurrentUserImage(user: JwtPayload, file: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException("No image file was uploaded");
    }

    const current = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!current) {
      throw new NotFoundException("User not found");
    }

    if (current.imageKey) {
      await this.storageService.deleteObject(current.imageKey);
    }

    const uploaded = await this.storageService.uploadUserImage(file, user.sub);

    return this.prisma.user.update({
      where: { id: user.sub },
      data: {
        imageUrl: uploaded.url,
        imageKey: uploaded.key,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserImage(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        imageKey: true,
      },
    });

    if (!user?.imageKey) {
      throw new NotFoundException("User image not found");
    }

    return this.storageService.getObject(user.imageKey);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }
}
