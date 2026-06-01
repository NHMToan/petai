import { IsIn, IsOptional, IsString } from "class-validator";

const VOICE_NAMES = ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"] as const;

export class ProcessVoiceTurnDto {
  @IsOptional()
  @IsString()
  @IsIn(VOICE_NAMES)
  voice?: (typeof VOICE_NAMES)[number];
}
