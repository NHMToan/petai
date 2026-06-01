import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { ChatService } from "./chat.service";
import { CreateRealtimeSessionDto } from "./dto/create-realtime-session.dto";
import { PostChatMessageDto } from "./dto/post-chat-message.dto";
import { ProcessVoiceTurnDto } from "./dto/process-voice-turn.dto";
import { SyncVoiceTurnDto } from "./dto/sync-voice-turn.dto";

@Controller("pets/:petId/chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Roles(Role.USER, Role.ADMIN)
  @Get()
  getConversation(@CurrentUser() user: JwtPayload, @Param("petId") petId: string) {
    return this.chatService.getConversationState(user, petId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post("messages")
  postMessage(
    @CurrentUser() user: JwtPayload,
    @Param("petId") petId: string,
    @Body() dto: PostChatMessageDto,
  ) {
    return this.chatService.postMessage(user, petId, dto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post("voice/client-secret")
  createRealtimeSession(
    @CurrentUser() user: JwtPayload,
    @Param("petId") petId: string,
    @Body() dto: CreateRealtimeSessionDto,
  ) {
    return this.chatService.createRealtimeClientSecret(user, petId, dto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post("voice/sync")
  syncVoiceTurn(
    @CurrentUser() user: JwtPayload,
    @Param("petId") petId: string,
    @Body() dto: SyncVoiceTurnDto,
  ) {
    return this.chatService.syncVoiceTurn(user, petId, dto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post("voice/turn")
  @UseInterceptors(FileInterceptor("file"))
  processVoiceTurn(
    @CurrentUser() user: JwtPayload,
    @Param("petId") petId: string,
    @UploadedFile() file: UploadedImageFile,
    @Body() dto: ProcessVoiceTurnDto,
  ) {
    return this.chatService.processVoiceTurn(user, petId, file, dto);
  }
}
