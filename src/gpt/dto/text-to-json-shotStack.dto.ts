import { IsArray, IsOptional, IsString } from 'class-validator';

export class TextToJsonShotStackDto {
  @IsString()
  readonly prompt: string;

  @IsOptional()
  @IsArray()
  readonly images?: string[];
}