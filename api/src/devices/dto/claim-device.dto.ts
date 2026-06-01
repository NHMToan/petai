import { IsString, MinLength } from "class-validator";

export class ClaimDeviceDto {
  @IsString()
  @MinLength(3)
  serialNumber!: string;

  @IsString()
  @MinLength(3)
  productCode!: string;
}
