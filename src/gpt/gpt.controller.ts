import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { ImageToTextDto, MindMapDto, TextToJsonShotStackDto } from './dto';

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

  @Post('text-to-json')
  textToJson(@Body() textToJsonShotStackDto: TextToJsonShotStackDto) {
    return this.gptService.jsonToText(textToJsonShotStackDto);
  }
}
