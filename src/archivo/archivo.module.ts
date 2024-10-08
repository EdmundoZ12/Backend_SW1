import { Module } from '@nestjs/common';
import { FirebaseUploadService } from './archivo.service';
import { FileUploadController } from './archivo.controller';
import { CrudArchivoModule } from './crud_archivo/crud_archivo.module';


@Module({
  controllers: [FileUploadController],
  providers: [FirebaseUploadService],
  imports: [CrudArchivoModule],
})
export class ArchivoModule {}
