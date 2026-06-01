import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateVoiceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  tone?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  locale?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  version?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
