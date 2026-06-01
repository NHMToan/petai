import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { PrismaService } from "../prisma/prisma.service";
import { CreateVoiceDto } from "./dto/create-voice.dto";
import { UpdateVoiceDto } from "./dto/update-voice.dto";

const PREVIEW_TTS_MODEL = "gpt-4o-mini-tts";
const FALLBACK_PREVIEW_VOICE = "marin";
const BUILT_IN_PREVIEW_VOICES = new Set([
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
]);

@Injectable()
export class VoicesService {
  private readonly openai: OpenAI | null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>("app.openaiApiKey");
    this.openai = apiKey ? new OpenAI({ apiKey }) : null;
  }

  findActive() {
    return this.prisma.voice.findMany({
      where: { isActive: true },
      orderBy: [{ name: "asc" }],
    });
  }

  findAll() {
    return this.prisma.voice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { pets: true },
        },
      },
    });
  }

  async findActiveById(id: string) {
    return this.prisma.voice.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.voice.findUnique({
      where: { id },
    });
  }

  create(dto: CreateVoiceDto) {
    return this.prisma.voice.create({
      data: {
        name: dto.name,
        description: dto.description,
        tone: dto.tone,
        locale: dto.locale,
        version: dto.version,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateVoiceDto) {
    await this.ensureExists(id);
    return this.prisma.voice.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.voice.delete({ where: { id } });
    return { success: true };
  }

  async generatePreviewAudio(id: string, options?: { allowInactive?: boolean }) {
    const voice = options?.allowInactive ? await this.findById(id) : await this.findActiveById(id);
    if (!voice) {
      throw new NotFoundException("Voice not found");
    }

    if (!this.openai) {
      throw new InternalServerErrorException("OpenAI API key is not configured");
    }

    const response = await this.openai.audio.speech.create({
      model: PREVIEW_TTS_MODEL,
      voice: this.resolvePreviewVoiceName(voice.name),
      input: this.buildPreviewScript(voice.name, voice.locale),
      instructions: `Speak in a ${voice.tone.toLowerCase()} tone for a PetAI companion voice preview.`,
      response_format: "mp3",
    });

    return {
      buffer: Buffer.from(await response.arrayBuffer()),
      contentType: "audio/mpeg",
      fileName: `${voice.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "voice"}-preview.mp3`,
      model: PREVIEW_TTS_MODEL,
      previewVoice: this.resolvePreviewVoiceName(voice.name),
    };
  }

  private async ensureExists(id: string) {
    const voice = await this.prisma.voice.findUnique({ where: { id } });
    if (!voice) {
      throw new NotFoundException("Voice not found");
    }
    return voice;
  }

  private resolvePreviewVoiceName(name: string) {
    const normalized = name.trim().toLowerCase();
    return BUILT_IN_PREVIEW_VOICES.has(normalized) ? normalized : FALLBACK_PREVIEW_VOICE;
  }

  private buildPreviewScript(name: string, locale: string) {
    if (locale.toLowerCase().startsWith("vi")) {
      return `Xin chao, minh la ${name}. Minh se dong hanh cung ban moi ngay voi giong noi am ap va tu nhien cua PetAI.`;
    }

    return `Hello, I'm ${name}. I'll be your PetAI companion voice, sounding warm, clear, and supportive each day.`;
  }
}
