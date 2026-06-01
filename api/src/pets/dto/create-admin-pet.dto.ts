import { IsOptional, IsString } from "class-validator";
import { CreatePetDto } from "./create-pet.dto";

export class CreateAdminPetDto extends CreatePetDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
