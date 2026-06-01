import { IsOptional, IsString } from "class-validator";
import { UpdatePetDto } from "./update-pet.dto";

export class UpdateAdminPetDto extends UpdatePetDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
