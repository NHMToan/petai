import { IsString, MaxLength, MinLength } from "class-validator";

export class SyncVoiceTurnDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  userTranscript!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  assistantTranscript!: string;
}
