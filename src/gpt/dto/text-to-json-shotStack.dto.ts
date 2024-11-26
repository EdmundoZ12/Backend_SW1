import { IsString } from 'class-validator';

export class TextToJsonShotStackDto {
  @IsString()
  readonly prompt: string;
}