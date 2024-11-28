import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShotstackService } from './shotstack.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shotstack')
@Controller('shotstack')
export class ShotstackController {
  constructor(private readonly shotstackService: ShotstackService) {}

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    return await this.shotstackService.createVideo(createVideoDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shotstackService.getVideo(id);
  }
}
