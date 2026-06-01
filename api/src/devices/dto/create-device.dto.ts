import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { DeviceStatus } from "@prisma/client";

export class CreateDeviceDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(3)
  serialNumber!: string;

  @IsString()
  @MinLength(3)
  productCode!: string;

  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;
}
