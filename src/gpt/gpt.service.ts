import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ImageToTextDto } from './dto/image-to-text.dto';
import { imageToTextUseCase } from './use-cases/image-to-text.use-case';

@Injectable()
export class GptService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('OPENAI_API_KEY is not set');
    }
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async imageToText(imageToTextDto: ImageToTextDto) {
    const { image_url } = imageToTextDto;
    try {
      return await imageToTextUseCase(this.openai, { image_url });
    } catch (error) {
      // Manejo de errores en caso de fallo en la comunicación con OpenAI
      throw new InternalServerErrorException(
        'Error processing image to text',
        error.message,
      );
    }
  }
}
