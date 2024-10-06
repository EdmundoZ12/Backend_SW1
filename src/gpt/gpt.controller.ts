import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { ImageToTextDto } from './dto/image-to-text.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('GPT-OPENAI') 
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('image-to-text')
  async imageToText(@Body() imageToTextDto: ImageToTextDto) {
    return await this.gptService.imageToText(imageToTextDto);
  }
}
