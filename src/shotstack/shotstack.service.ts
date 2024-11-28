import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import axios from 'axios';
import { Video } from './entities/video.entity';

@Injectable()
export class ShotstackService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.shotstack.io/edit/stage';

  constructor(
    private configService: ConfigService,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {
    this.apiKey = this.configService.get<string>('SHOTSTACK_API_KEY');
  }

  async createVideo(createVideoDto: CreateVideoDto) {
    try {
      console.log('Request payload:', JSON.stringify(createVideoDto, null, 2));

      const response = await axios.post(
        `${this.apiUrl}/render`,
        createVideoDto,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
          },
        },
      );

      console.log('Shotstack response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.response?.data || 'Error creating video',
          details: error.response?.data?.message || error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getVideo(id: string) {
    const maxRetries = 10; // Número máximo de reintentos
    const delayMs = 5000; // Tiempo de espera entre reintentos (5 segundos)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await axios.get(`${this.apiUrl}/render/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
          },
        });

        if (response.data.success && response.data.response?.url) {
          return response.data; // Devuelve el video si está listo
        }

        console.log(`Attempt ${attempt + 1}: Video not ready yet`);
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error.message);
      }

      // Espera antes del próximo intento
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new HttpException(
      'Video not ready after maximum retries',
      HttpStatus.REQUEST_TIMEOUT,
    );
  }
}
