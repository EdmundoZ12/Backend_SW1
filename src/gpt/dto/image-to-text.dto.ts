import { IsString } from 'class-validator';

export class ImageToTextDto {
  @IsString()
  readonly image_url: string;
}
