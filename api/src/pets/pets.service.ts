import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import { StorageService } from "../storage/storage.service";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { VoicesService } from "../voices/voices.service";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly voicesService: VoicesService,
  ) {}

  async findMyPets(userId: string) {
    return this.prisma.pet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        device: true,
        voice: true,
      },
    });
  }

  async findMyPetById(user: JwtPayload, id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        device: true,
        voice: true,
      },
    });

    if (!pet) {
      throw new NotFoundException("Pet not found");
    }

    if (pet.userId !== user.sub && user.role !== "ADMIN") {
      throw new ForbiddenException("You do not have access to this pet");
    }

    return pet;
  }

  async createForUser(user: JwtPayload, dto: CreatePetDto) {
    await this.ensureVoiceSelectable(dto.voiceId, user.role === "ADMIN");
    return this.prisma.pet.create({
      data: {
        ...dto,
        userId: user.sub,
      },
      include: {
        device: true,
        voice: true,
      },
    });
  }

  async updateMyPet(user: JwtPayload, id: string, dto: UpdatePetDto) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException("Pet not found");
    }
    if (pet.userId !== user.sub && user.role !== "ADMIN") {
      throw new ForbiddenException("You do not have access to this pet");
    }

    await this.ensureVoiceSelectable(dto.voiceId, user.role === "ADMIN");

    return this.prisma.pet.update({
      where: { id },
      data: {
        ...dto,
        deviceId: dto.deviceId === undefined ? undefined : dto.deviceId,
        voiceId: dto.voiceId === undefined ? undefined : dto.voiceId,
      },
      include: {
        device: true,
        voice: true,
      },
    });
  }

  async uploadPetImage(user: JwtPayload, id: string, file?: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException("No image file was uploaded");
    }

    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException("Pet not found");
    }
    if (pet.userId !== user.sub && user.role !== "ADMIN") {
      throw new ForbiddenException("You do not have access to this pet");
    }

    const uploaded = await this.storageService.uploadPetImage(file, pet.id);
    if (pet.imageKey) {
      await this.storageService.deleteObject(pet.imageKey);
    }

    return this.prisma.pet.update({
      where: { id },
      data: {
        imageUrl: uploaded.url,
        imageKey: uploaded.key,
      },
      include: {
        device: true,
        voice: true,
      },
    });
  }

  async removeMyPet(user: JwtPayload, id: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException("Pet not found");
    }
    if (pet.userId !== user.sub && user.role !== "ADMIN") {
      throw new ForbiddenException("You do not have access to this pet");
    }

    await this.prisma.pet.delete({ where: { id } });
    return { success: true };
  }

  async findAllAdmin() {
    return this.prisma.pet.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        device: true,
        voice: true,
      },
    });
  }

  async createAdmin(dto: CreatePetDto & { userId?: string | null }) {
    await this.ensureDeviceAssignable(dto.deviceId);
    await this.ensureVoiceSelectable(dto.voiceId, true);
    return this.prisma.pet.create({
      data: {
        ...dto,
        userId: dto.userId || null,
      },
      include: {
        owner: true,
        device: true,
        voice: true,
      },
    });
  }

  async updateAdmin(id: string, dto: UpdatePetDto & { userId?: string }) {
    await this.ensureExists(id);
    await this.ensureDeviceAssignable(dto.deviceId, id);
    await this.ensureVoiceSelectable(dto.voiceId, true);
    return this.prisma.pet.update({
      where: { id },
      data: {
        ...dto,
        userId: dto.userId === undefined ? undefined : dto.userId || null,
      },
      include: {
        owner: true,
        device: true,
        voice: true,
      },
    });
  }

  async removeAdmin(id: string) {
    await this.ensureExists(id);
    await this.prisma.pet.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException("Pet not found");
    }
    return pet;
  }

  private async ensureDeviceAssignable(deviceId?: string | null, currentPetId?: string) {
    if (!deviceId) {
      return;
    }

    const existing = await this.prisma.pet.findFirst({
      where: {
        deviceId,
        id: currentPetId ? { not: currentPetId } : undefined,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (existing) {
      throw new ForbiddenException(`This device is already assigned to pet "${existing.name}"`);
    }
  }

  private async ensureVoiceSelectable(voiceId?: string | null, allowInactive = false) {
    if (voiceId === undefined) {
      return;
    }

    if (!voiceId) {
      return;
    }

    if (allowInactive) {
      const voice = await this.prisma.voice.findUnique({ where: { id: voiceId } });
      if (!voice) {
        throw new NotFoundException("Voice not found");
      }
      return;
    }

    const voice = await this.voicesService.findActiveById(voiceId);
    if (!voice) {
      throw new ForbiddenException("This voice is not available for user selection");
    }
  }
}
