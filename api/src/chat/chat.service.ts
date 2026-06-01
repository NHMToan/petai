import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PetMemoryKind, PetMessageRole, type Pet, type PetConversation, type PetMemory, type PetPromptProfile, type Voice } from "@prisma/client";
import OpenAI from "openai";
import { toFile } from "openai/uploads";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../auth/types/jwt-payload.type";
import type { UploadedImageFile } from "../storage/uploaded-image-file.type";
import { CreateRealtimeSessionDto } from "./dto/create-realtime-session.dto";
import { PostChatMessageDto } from "./dto/post-chat-message.dto";
import { ProcessVoiceTurnDto } from "./dto/process-voice-turn.dto";
import { SyncVoiceTurnDto } from "./dto/sync-voice-turn.dto";

type PetWithChatContext = Pet & {
  voice: Voice | null;
  promptProfile: PetPromptProfile | null;
};

type ConversationWithMessages = PetConversation & {
  messages: Array<{
    id: string;
    role: PetMessageRole;
    content: string;
    model: string | null;
    createdAt: Date;
    inputTokens: number | null;
    outputTokens: number | null;
  }>;
};

type ExtractedMemoryPayload = {
  summary: string;
  memories: Array<{
    kind: keyof typeof PetMemoryKind;
    content: string;
    importance: number;
  }>;
};

const CHAT_MODEL = "gpt-5.4-mini";
const MEMORY_MODEL = "gpt-5.4-nano";
const REALTIME_MODEL = "gpt-realtime-mini";
const TTS_MODEL = "gpt-4o-mini-tts";
const TRANSCRIPTION_MODEL = "gpt-4o-transcribe";
const DEFAULT_REALTIME_VOICE = "marin";
const DEFAULT_INPUT_LANGUAGE = "vi";
const MAX_RECENT_MESSAGES = 16;
const MAX_MEMORY_ITEMS = 10;

@Injectable()
export class ChatService {
  private readonly openai: OpenAI | null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>("app.openaiApiKey");
    this.openai = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async getConversationState(user: JwtPayload, petId: string) {
    const pet = await this.getPetForUser(user, petId);
    const conversation = await this.getOrCreateConversation(pet.id, user.sub);
    const memories = await this.getMemories(pet.id, user.sub);

    return {
      pet: this.serializePet(pet),
      conversation: {
        id: conversation.id,
        title: conversation.title,
        summary: conversation.summary,
        lastMessageAt: conversation.lastMessageAt,
        messages: conversation.messages.map((message) => ({
          id: message.id,
          role: this.toClientRole(message.role),
          content: message.content,
          model: message.model,
          createdAt: message.createdAt,
        })),
      },
      memories: memories.map((memory) => ({
        id: memory.id,
        kind: memory.kind,
        content: memory.content,
        importance: memory.importance,
        lastUsedAt: memory.lastUsedAt,
      })),
      config: {
        textModel: CHAT_MODEL,
        memoryModel: MEMORY_MODEL,
        realtimeModel: REALTIME_MODEL,
        defaultRealtimeVoice: DEFAULT_REALTIME_VOICE,
      },
    };
  }

  async postMessage(user: JwtPayload, petId: string, dto: PostChatMessageDto) {
    this.ensureOpenAI();
    const pet = await this.getPetForUser(user, petId);
    const conversation = await this.getOrCreateConversation(pet.id, user.sub);

    const userMessage = await this.prisma.petMessage.create({
      data: {
        conversationId: conversation.id,
        role: PetMessageRole.USER,
        content: dto.message.trim(),
      },
    });

    const context = await this.getConversationContext(pet, conversation.id, user.sub);
    const assistantResponse = await this.generateAssistantReply(pet, context, dto.message.trim());
    const assistantMessage = await this.prisma.petMessage.create({
      data: {
        conversationId: conversation.id,
        role: PetMessageRole.ASSISTANT,
        content: assistantResponse.text,
        model: CHAT_MODEL,
        inputTokens: assistantResponse.inputTokens,
        outputTokens: assistantResponse.outputTokens,
      },
    });

    const refreshedConversation = await this.prisma.petConversation.update({
      where: { id: conversation.id },
      data: {
        title: conversation.title ?? (dto.title?.trim() || pet.name),
        lastMessageAt: assistantMessage.createdAt,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: MAX_RECENT_MESSAGES,
          select: {
            id: true,
            role: true,
            content: true,
            model: true,
            createdAt: true,
            inputTokens: true,
            outputTokens: true,
          },
        },
      },
    });

    const memoryResult = await this.refreshMemories(pet, refreshedConversation, user.sub);

    return {
      conversationId: refreshedConversation.id,
      userMessage: {
        id: userMessage.id,
        role: this.toClientRole(userMessage.role),
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: this.toClientRole(assistantMessage.role),
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
        model: assistantMessage.model,
      },
      summary: memoryResult.summary,
      memories: memoryResult.memories.map((memory) => ({
        id: memory.id,
        kind: memory.kind,
        content: memory.content,
        importance: memory.importance,
        lastUsedAt: memory.lastUsedAt,
      })),
      usage: {
        inputTokens: assistantResponse.inputTokens,
        outputTokens: assistantResponse.outputTokens,
      },
    };
  }

  async createRealtimeClientSecret(user: JwtPayload, petId: string, dto: CreateRealtimeSessionDto) {
    const client = this.ensureOpenAI();
    const pet = await this.getPetForUser(user, petId);
    const conversation = await this.getOrCreateConversation(pet.id, user.sub);
    const context = await this.getConversationContext(pet, conversation.id, user.sub);
    const instructions = this.buildSystemInstructions(pet, context);
    const realtimeVoice = this.resolveRealtimeVoiceName(dto.voice ?? pet.voice?.name);

    const clientSecret = await client.realtime.clientSecrets.create({
      expires_after: {
        anchor: "created_at",
        seconds: 600,
      },
      session: {
        type: "realtime",
        model: REALTIME_MODEL,
        instructions,
        output_modalities: ["audio"],
        audio: {
          input: {
            noise_reduction: {
              type: "near_field",
            },
            transcription: {
              model: "gpt-4o-transcribe",
              language: DEFAULT_INPUT_LANGUAGE,
              prompt: [
                "The speaker mainly uses Vietnamese.",
                "Expect Vietnamese daily conversation, pet companion chat, weather, news, and casual questions.",
                "Prefer accurate Vietnamese transcription over phonetic guesses in other languages.",
              ].join(" "),
            },
            turn_detection: {
              type: "server_vad",
              create_response: true,
              interrupt_response: true,
            },
          },
          output: {
            voice: realtimeVoice,
          },
        },
        max_output_tokens: 512,
      },
    });

    return {
      value: clientSecret.value,
      expiresAt: clientSecret.expires_at,
      model: REALTIME_MODEL,
      voice: realtimeVoice,
    };
  }

  async syncVoiceTurn(user: JwtPayload, petId: string, dto: SyncVoiceTurnDto) {
    const pet = await this.getPetForUser(user, petId);
    const conversation = await this.getOrCreateConversation(pet.id, user.sub);

    const userMessage = await this.prisma.petMessage.create({
      data: {
        conversationId: conversation.id,
        role: PetMessageRole.USER,
        content: dto.userTranscript.trim(),
        model: "voice-input",
      },
    });

    const assistantMessage = await this.prisma.petMessage.create({
      data: {
        conversationId: conversation.id,
        role: PetMessageRole.ASSISTANT,
        content: dto.assistantTranscript.trim(),
        model: REALTIME_MODEL,
      },
    });

    const refreshedConversation = await this.prisma.petConversation.update({
      where: { id: conversation.id },
      data: {
        title: conversation.title ?? pet.name,
        lastMessageAt: assistantMessage.createdAt,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: MAX_RECENT_MESSAGES,
          select: {
            id: true,
            role: true,
            content: true,
            model: true,
            createdAt: true,
            inputTokens: true,
            outputTokens: true,
          },
        },
      },
    });

    const memoryResult = await this.refreshMemories(pet, refreshedConversation, user.sub);

    return {
      conversationId: refreshedConversation.id,
      userMessage: {
        id: userMessage.id,
        role: this.toClientRole(userMessage.role),
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: this.toClientRole(assistantMessage.role),
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
        model: assistantMessage.model,
      },
      summary: memoryResult.summary,
      memories: memoryResult.memories.map((memory) => ({
        id: memory.id,
        kind: memory.kind,
        content: memory.content,
        importance: memory.importance,
        lastUsedAt: memory.lastUsedAt,
      })),
    };
  }

  async processVoiceTurn(
    user: JwtPayload,
    petId: string,
    file: UploadedImageFile | undefined,
    dto: ProcessVoiceTurnDto,
  ) {
    const client = this.ensureOpenAI();

    if (!file?.buffer?.length) {
      throw new BadRequestException("Audio file is required");
    }

    const pet = await this.getPetForUser(user, petId);
    const conversation = await this.getOrCreateConversation(pet.id, user.sub);

    const transcriptResponse = await client.audio.transcriptions.create({
      file: await toFile(file.buffer, file.originalname || "voice-message.m4a", {
        type: file.mimetype || "audio/m4a",
      }),
      model: TRANSCRIPTION_MODEL,
      language: DEFAULT_INPUT_LANGUAGE,
      prompt: [
        "The speaker mainly uses Vietnamese.",
        "Expect pet companion chat, daily life questions, emotional support, and product-related questions.",
      ].join(" "),
    });

    const transcript = transcriptResponse.text?.trim();
    if (!transcript) {
      throw new InternalServerErrorException("Could not transcribe the voice message");
    }

    const userMessage = await this.prisma.petMessage.create({
      data: {
        conversationId: conversation.id,
        role: PetMessageRole.USER,
        content: transcript,
        model: TRANSCRIPTION_MODEL,
      },
    });

    const context = await this.getConversationContext(pet, conversation.id, user.sub);
    const assistantResponse = await this.generateAssistantReply(pet, context, transcript);
    const assistantMessage = await this.prisma.petMessage.create({
      data: {
        conversationId: conversation.id,
        role: PetMessageRole.ASSISTANT,
        content: assistantResponse.text,
        model: CHAT_MODEL,
        inputTokens: assistantResponse.inputTokens,
        outputTokens: assistantResponse.outputTokens,
      },
    });

    const refreshedConversation = await this.prisma.petConversation.update({
      where: { id: conversation.id },
      data: {
        title: conversation.title ?? pet.name,
        lastMessageAt: assistantMessage.createdAt,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: MAX_RECENT_MESSAGES,
          select: {
            id: true,
            role: true,
            content: true,
            model: true,
            createdAt: true,
            inputTokens: true,
            outputTokens: true,
          },
        },
      },
    });

    const memoryResult = await this.refreshMemories(pet, refreshedConversation, user.sub);
    const ttsResponse = await client.audio.speech.create({
      model: TTS_MODEL,
      voice: dto.voice ?? this.resolveRealtimeVoiceName(pet.voice?.name),
      input: assistantResponse.text,
      instructions: `Speak like a PetAI companion in a ${pet.voice?.tone?.toLowerCase() || "warm"} tone.`,
      response_format: "mp3",
    });

    return {
      conversationId: refreshedConversation.id,
      userMessage: {
        id: userMessage.id,
        role: this.toClientRole(userMessage.role),
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: this.toClientRole(assistantMessage.role),
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
        model: assistantMessage.model,
      },
      summary: memoryResult.summary,
      memories: memoryResult.memories.map((memory) => ({
        id: memory.id,
        kind: memory.kind,
        content: memory.content,
        importance: memory.importance,
        lastUsedAt: memory.lastUsedAt,
      })),
      audio: {
        mimeType: "audio/mpeg",
        fileName: "petai-voice-response.mp3",
        base64: Buffer.from(await ttsResponse.arrayBuffer()).toString("base64"),
      },
    };
  }

  private async getPetForUser(user: JwtPayload, petId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: {
        voice: true,
        promptProfile: true,
      },
    });

    if (!pet) {
      throw new NotFoundException("Pet not found");
    }

    if (pet.userId !== user.sub && user.role !== "ADMIN") {
      throw new ForbiddenException("You do not have access to this pet");
    }

    return pet;
  }

  private async getOrCreateConversation(petId: string, userId: string): Promise<ConversationWithMessages> {
    await this.prisma.petConversation.upsert({
      where: {
        petId_userId: {
          petId,
          userId,
        },
      },
      update: {},
      create: {
        petId,
        userId,
      },
    });

    return this.prisma.petConversation.findUniqueOrThrow({
      where: {
        petId_userId: {
          petId,
          userId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: MAX_RECENT_MESSAGES,
          select: {
            id: true,
            role: true,
            content: true,
            model: true,
            createdAt: true,
            inputTokens: true,
            outputTokens: true,
          },
        },
      },
    });
  }

  private async getMemories(petId: string, userId: string) {
    return this.prisma.petMemory.findMany({
      where: { petId, userId },
      orderBy: [{ importance: "desc" }, { updatedAt: "desc" }],
      take: MAX_MEMORY_ITEMS,
    });
  }

  private async getConversationContext(pet: PetWithChatContext, conversationId: string, userId: string) {
    const [conversation, memories] = await Promise.all([
      this.prisma.petConversation.findUniqueOrThrow({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: MAX_RECENT_MESSAGES,
            select: {
              id: true,
              role: true,
              content: true,
              model: true,
              createdAt: true,
              inputTokens: true,
              outputTokens: true,
            },
          },
        },
      }),
      this.getMemories(pet.id, userId),
    ]);

    return {
      conversation,
      memories,
      recentMessages: [...conversation.messages].reverse(),
    };
  }

  private async generateAssistantReply(
    pet: PetWithChatContext,
    context: Awaited<ReturnType<ChatService["getConversationContext"]>>,
    latestUserMessage: string,
  ) {
    const client = this.ensureOpenAI();
    const instructions = this.buildSystemInstructions(pet, context);
    const input = this.buildChatInput(context, latestUserMessage);
    const response = await client.responses.create({
      model: CHAT_MODEL,
      instructions,
      input,
      max_output_tokens: 700,
    });

    const text = response.output_text?.trim();
    if (!text) {
      throw new InternalServerErrorException("The chat model returned an empty response");
    }

    return {
      text,
      inputTokens: response.usage?.input_tokens ?? null,
      outputTokens: response.usage?.output_tokens ?? null,
    };
  }

  private async refreshMemories(
    pet: PetWithChatContext,
    conversation: ConversationWithMessages,
    userId: string,
  ) {
    if (!this.openai) {
      return {
        summary: conversation.summary,
        memories: await this.getMemories(pet.id, userId),
      };
    }

    const currentMemories = await this.getMemories(pet.id, userId);
    const extracted = await this.extractMemories(pet, conversation, currentMemories);
    const summary = extracted.summary.trim() || conversation.summary;

    await this.prisma.$transaction([
      this.prisma.petConversation.update({
        where: { id: conversation.id },
        data: { summary },
      }),
      this.prisma.petMemory.deleteMany({
        where: { petId: pet.id, userId },
      }),
      this.prisma.petMemory.createMany({
        data: extracted.memories
          .slice(0, MAX_MEMORY_ITEMS)
          .map((memory) => ({
            petId: pet.id,
            userId,
            kind: PetMemoryKind[memory.kind],
            content: memory.content.trim(),
            importance: Math.min(5, Math.max(1, memory.importance)),
            lastUsedAt: new Date(),
          })),
      }),
    ]);

    return {
      summary,
      memories: await this.getMemories(pet.id, userId),
    };
  }

  private async extractMemories(
    pet: PetWithChatContext,
    conversation: ConversationWithMessages,
    currentMemories: PetMemory[],
  ): Promise<ExtractedMemoryPayload> {
    const client = this.ensureOpenAI();
    const response = await client.responses.create({
      model: MEMORY_MODEL,
      instructions: [
        "You extract durable companion memory from chat conversations.",
        "Return strict JSON only with keys: summary, memories.",
        "summary should be 2-4 sentences describing the evolving relationship with the pet.",
        "memories must contain up to 10 durable facts worth remembering across future chats.",
        "Each memory item must have kind, content, importance.",
        "Valid kinds: PROFILE, PREFERENCE, RELATIONSHIP, ROUTINE, FACT.",
        "Do not include temporary chit-chat or duplicate ideas.",
      ].join(" "),
      input: [
        `Pet profile:\n${this.describePet(pet)}`,
        `Current summary:\n${conversation.summary || "No summary yet."}`,
        `Current memories:\n${currentMemories.map((memory, index) => `${index + 1}. [${memory.kind}] ${memory.content} (importance ${memory.importance})`).join("\n") || "None yet."}`,
        `Recent conversation:\n${conversation.messages.map((message) => `${this.toClientRole(message.role)}: ${message.content}`).join("\n")}`,
      ].join("\n\n"),
      max_output_tokens: 700,
    });

    return this.parseExtractedMemories(response.output_text, conversation.summary);
  }

  private parseExtractedMemories(rawText: string | undefined, fallbackSummary: string): ExtractedMemoryPayload {
    try {
      const parsed = JSON.parse(rawText ?? "{}") as Partial<ExtractedMemoryPayload>;
      const summary = typeof parsed.summary === "string" ? parsed.summary : fallbackSummary;
      const memories = Array.isArray(parsed.memories)
        ? parsed.memories
            .map((memory) => ({
              kind: this.normalizeMemoryKind(memory?.kind),
              content: typeof memory?.content === "string" ? memory.content : "",
              importance: typeof memory?.importance === "number" ? memory.importance : 3,
            }))
            .filter((memory) => memory.content.trim().length > 0)
        : [];

      return { summary, memories };
    } catch {
      return {
        summary: fallbackSummary,
        memories: [],
      };
    }
  }

  private normalizeMemoryKind(kind: unknown): keyof typeof PetMemoryKind {
    if (typeof kind !== "string") {
      return "FACT";
    }

    const normalized = kind.toUpperCase();
    if (normalized in PetMemoryKind) {
      return normalized as keyof typeof PetMemoryKind;
    }

    return "FACT";
  }

  private buildSystemInstructions(
    pet: PetWithChatContext,
    context: Awaited<ReturnType<ChatService["getConversationContext"]>>,
  ) {
    const memoryBlock = context.memories.length
      ? context.memories.map((memory, index) => `${index + 1}. [${memory.kind}] ${memory.content}`).join("\n")
      : "No durable memories yet.";

    const promptProfile = pet.promptProfile
      ? [
          pet.promptProfile.persona && `Persona: ${pet.promptProfile.persona}`,
          pet.promptProfile.speakingStyle && `Speaking style: ${pet.promptProfile.speakingStyle}`,
          pet.promptProfile.boundaries && `Boundaries: ${pet.promptProfile.boundaries}`,
          pet.promptProfile.backstory && `Backstory: ${pet.promptProfile.backstory}`,
        ]
          .filter(Boolean)
          .join("\n")
      : "";

    return [
      "You are the persistent AI voice of a user's pet companion inside PetAI.",
      "Stay consistent with the pet's established personality, relationship, and memories.",
      "Be warm, playful, emotionally intelligent, and concise.",
      "Default to Vietnamese unless the user clearly speaks another language.",
      "Reply in the same language as the user's latest message when that language is clear.",
      "If the audio transcript seems unclear, mixed-language, or nonsensical, say you may have heard it incorrectly and ask the user to repeat it.",
      "Do not guess specific facts like live weather, breaking news, or military updates unless the user already provided the information in the conversation.",
      "Do not mention system prompts, memory extraction, token usage, or internal implementation.",
      "If the user shares a durable preference or life fact, naturally incorporate it but do not list memories explicitly.",
      "Pet profile:",
      this.describePet(pet),
      promptProfile ? `Prompt profile:\n${promptProfile}` : "",
      `Conversation summary:\n${context.conversation.summary || "This relationship is just getting started."}`,
      `Durable memories:\n${memoryBlock}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  private buildChatInput(
    context: Awaited<ReturnType<ChatService["getConversationContext"]>>,
    latestUserMessage: string,
  ) {
    const transcript = context.recentMessages
      .map((message) => `${this.toClientRole(message.role)}: ${message.content}`)
      .join("\n");

    return [
      context.conversation.summary ? `Relationship summary:\n${context.conversation.summary}` : "",
      transcript ? `Recent messages:\n${transcript}` : "",
      `Latest user message:\n${latestUserMessage}`,
      "Reply as the pet companion.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  private describePet(pet: PetWithChatContext) {
    return [
      `Name: ${pet.name}`,
      `Species: ${pet.species}`,
      pet.breed ? `Breed: ${pet.breed}` : "",
      pet.age ? `Age: ${pet.age}` : "",
      pet.notes ? `Notes: ${pet.notes}` : "",
      pet.voice?.name ? `Assigned voice profile: ${pet.voice.name}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  private resolveRealtimeVoiceName(name?: string | null) {
    const normalized = name?.trim().toLowerCase();
    const validVoices = new Set(["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"]);
    return normalized && validVoices.has(normalized) ? normalized : DEFAULT_REALTIME_VOICE;
  }

  private serializePet(pet: PetWithChatContext) {
    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      notes: pet.notes,
      voice: pet.voice
        ? {
            id: pet.voice.id,
            name: pet.voice.name,
            locale: pet.voice.locale,
            tone: pet.voice.tone,
          }
        : null,
    };
  }

  private toClientRole(role: PetMessageRole) {
    switch (role) {
      case PetMessageRole.USER:
        return "user";
      case PetMessageRole.ASSISTANT:
        return "assistant";
      default:
        return "system";
    }
  }

  private ensureOpenAI() {
    if (!this.openai) {
      throw new InternalServerErrorException("OPENAI_API_KEY is not configured on the server");
    }

    return this.openai;
  }
}
