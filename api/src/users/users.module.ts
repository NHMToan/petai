import { Module } from "@nestjs/common";
import { StorageModule } from "../storage/storage.module";
import { CurrentUserController, UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [StorageModule],
  controllers: [UsersController, CurrentUserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
