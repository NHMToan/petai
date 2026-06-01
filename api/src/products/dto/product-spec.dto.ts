import { IsString, MinLength } from "class-validator";

export class ProductSpecDto {
  @IsString()
  @MinLength(1)
  icon!: string;

  @IsString()
  @MinLength(1)
  label!: string;

  @IsString()
  @MinLength(1)
  value!: string;
}

