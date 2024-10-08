import { Controller, Post, UseInterceptors, UploadedFiles, Param, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FirebaseUploadService } from './archivo.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';


@Controller('upload')
export class FileUploadController {
  constructor(private readonly firebaseUploadService: FirebaseUploadService) {}

  @Post('archivos_apuntes/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 20, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
      }
    })
  }))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: number
  ) {
    return this.firebaseUploadService.uploadToFirebase(files, id);
  }
}