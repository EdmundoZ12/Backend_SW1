import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { ApiTags } from '@nestjs/swagger';
import { ImageToTextDto, MindMapDto } from './dto';


@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('image-to-text')
  async imageToText(@Body() imageToTextDto: ImageToTextDto) {
    return await this.gptService.imageToText(imageToTextDto);
  }

  @Post('mind-map')
  mindMap(@Body() mindMapDto: MindMapDto) {
    return this.gptService.mindMap(mindMapDto);
  }
}
