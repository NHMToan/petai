import { Controller, Get } from "@nestjs/common";
import { Public } from "./auth/decorators/public.decorator";

@Controller()
export class AppController {
  @Public()
  @Get("health")
  health() {
    return {
      service: "petai-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
