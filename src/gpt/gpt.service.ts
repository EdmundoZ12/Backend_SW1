import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ImageToTextDto } from './dto/image-to-text.dto';
import { imageToTextUseCase } from './use-cases/image-to-text.use-case';

@Injectable()
export class GptService {
  constructor(readonly configService: ConfigService) {}

  private openai = new OpenAI({
    apiKey: this.configService.get<string>('OPENAI_API_KEY'),
  });

  async imageToText(imageToTextDto: ImageToTextDto) {
    const { image_url } = imageToTextDto;
    return await imageToTextUseCase(this.openai, { image_url });
  }
}
