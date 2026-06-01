import { Module } from "@nestjs/common";
import { PetsController } from "./pets.controller";
import { PetsService } from "./pets.service";
import { StorageModule } from "../storage/storage.module";
import { VoicesModule } from "../voices/voices.module";

@Module({
  imports: [StorageModule, VoicesModule],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
