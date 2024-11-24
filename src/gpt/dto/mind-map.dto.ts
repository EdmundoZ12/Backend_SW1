import { IsString } from 'class-validator';

export class MindMapDto {
  @IsString()
  readonly prompt: string;
}
