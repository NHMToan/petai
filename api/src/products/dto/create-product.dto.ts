import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { ProductSpecDto } from "./product-spec.dto";

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  slug!: string;

  @IsString()
  @MinLength(2)
  tagline!: string;

  @IsString()
  @MinLength(2)
  shortDescription!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsString()
  @MinLength(2)
  longDescription!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @MinLength(3)
  heroImage!: string;

  @IsArray()
  @IsString({ each: true })
  gallery!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecDto)
  specs!: ProductSpecDto[];

  @IsString()
  @MinLength(2)
  category!: string;

  @IsString()
  @MinLength(2)
  badge!: string;

  @IsOptional()
  @IsString()
  imageKey?: string;
}
