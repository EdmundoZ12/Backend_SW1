import { IsObject, IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsObject()
  timeline: {
    soundtrack?: {
      src: string;
      effect?: string;
    };
    background?: string;
    tracks: {
      clips: any[];
    }[];
  };

  @IsNotEmpty()
  @IsObject()
  output: {
    format: string;
    size: {
      width: number;
      height: number;
    };
  };
}
