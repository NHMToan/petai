import { Module } from "@nestjs/common";
import { PublicVoicesController, VoicesController } from "./voices.controller";
import { VoicesService } from "./voices.service";

@Module({
  controllers: [PublicVoicesController, VoicesController],
  providers: [VoicesService],
  exports: [VoicesService],
})
export class VoicesModule {}
