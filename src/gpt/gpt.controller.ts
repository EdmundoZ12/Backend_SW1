import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { ImageToTextDto, MindMapDto, TextToJsonShotStackDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudioToTextDto } from './dto/audio-to-text.dto';

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText (
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5mb'
          }),
          new FileTypeValidator({
            fileType: 'audio/*'
          })
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }
}
