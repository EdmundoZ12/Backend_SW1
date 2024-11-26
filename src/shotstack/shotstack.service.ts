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
    try {
      const response = await axios.get(`${this.apiUrl}/render/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      if (!response.data.success) {
        throw new HttpException(
          'Shotstack API error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response?.data?.message || 'Error fetching video status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
