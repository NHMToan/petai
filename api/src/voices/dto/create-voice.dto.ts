import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateVoiceDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(2)
  tone!: string;

  @IsString()
  @MinLength(2)
  locale!: string;

  @IsString()
  @MinLength(1)
  version!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
