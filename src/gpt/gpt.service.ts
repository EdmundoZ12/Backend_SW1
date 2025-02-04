import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { ImageToTextDto, MindMapDto, TextToJsonShotStackDto } from './dto';
import {
  imageToTextUseCase,
  mindMapUseCase,
  textToJsonShotStackUseCase,
} from './use-cases';
import { AudioToTextDto } from './dto/audio-to-text.dto';
import { audioToTextUseCase } from './use-cases/audio-to-text.use-case';

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

  async mindMap(mindMapDto: MindMapDto) {
    return await mindMapUseCase(this.openai, {
      prompt: mindMapDto.prompt,
    });
  }

  async jsonToText(textToJsonShotStackDto: TextToJsonShotStackDto) {
    return await textToJsonShotStackUseCase(this.openai, {
      prompt: textToJsonShotStackDto.prompt,
      images: textToJsonShotStackDto.images,
    });
  }

  async audioToText (audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openai, { prompt, audioFile });
  }
}
