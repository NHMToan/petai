import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DeviceStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import { ClaimDeviceDto } from "./dto/claim-device.dto";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { UpdateDeviceDto } from "./dto/update-device.dto";

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async claimDevice(user: JwtPayload, dto: ClaimDeviceDto) {
    const device = await this.prisma.device.findFirst({
      where: {
        serialNumber: dto.serialNumber,
        productCode: dto.productCode,
      },
    });

    if (!device) {
      throw new NotFoundException("Device not found for the provided serial number and product code");
    }

    if (device.claimedById && device.claimedById !== user.sub) {
      throw new BadRequestException("Device has already been claimed");
    }

    return this.prisma.$transaction(async (tx) => {
      const claimedDevice =
        device.claimedById === user.sub && device.status === DeviceStatus.CLAIMED
          ? await tx.device.findUniqueOrThrow({
              where: { id: device.id },
              include: {
                claimedBy: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            })
          : await tx.device.update({
              where: { id: device.id },
              data: {
                status: DeviceStatus.CLAIMED,
                claimedAt: new Date(),
                claimedById: user.sub,
              },
              include: {
                claimedBy: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            });

      const provisionedPet = await tx.pet.findFirst({
        where: { deviceId: device.id },
        include: {
          device: true,
          voice: true,
        },
      });

      if (!provisionedPet) {
        throw new NotFoundException("No pet has been provisioned for this device yet");
      }

      if (provisionedPet.userId && provisionedPet.userId !== user.sub) {
        throw new BadRequestException("This pet has already been claimed by another user");
      }

      const pet =
        provisionedPet.userId === user.sub
          ? provisionedPet
          : await tx.pet.update({
              where: { id: provisionedPet.id },
              data: {
                userId: user.sub,
                notes: provisionedPet.notes ?? `Claimed from device ${device.serialNumber}.`,
              },
              include: {
                device: true,
                voice: true,
              },
            });

      return {
        device: claimedDevice,
        pet,
      };
    });
  }

  async findAllAdmin() {
    return this.prisma.device.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        claimedBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        pets: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(dto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: {
        name: dto.name,
        serialNumber: dto.serialNumber,
        productCode: dto.productCode,
        status: dto.status ?? DeviceStatus.AVAILABLE,
      },
    });
  }

  async update(id: string, dto: UpdateDeviceDto) {
    await this.ensureExists(id);
    return this.prisma.device.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.device.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const device = await this.prisma.device.findUnique({ where: { id } });
    if (!device) {
      throw new NotFoundException("Device not found");
    }
    return device;
  }
}
