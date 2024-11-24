import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { ImageToTextDto, MindMapDto } from './dto';
import { imageToTextUseCase, mindMapUseCase } from './use-cases';

@Injectable()
export class GptService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
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

  async mindMap (mindMapDto: MindMapDto) {
    return await mindMapUseCase(this.openai, {
      prompt: mindMapDto.prompt
    });
  }
}
