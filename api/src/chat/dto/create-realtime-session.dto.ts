import { IsOptional, IsString } from "class-validator";

export class CreateRealtimeSessionDto {
  @IsOptional()
  @IsString()
  voice?: string;
}
