import { Injectable } from '@nestjs/common';
import admin from './firebaseConfig.service';
import * as path from 'path';
import { CrudArchivoService } from './crud_archivo/crud_archivo.service';
import { CreateCrudArchivoDto } from './crud_archivo/dto/create-crud_archivo.dto';

@Injectable()
export class FirebaseUploadService {
  
  constructor(private readonly crudArchivoService:CrudArchivoService){}

  async uploadToFirebase(files: Express.Multer.File[], id: number): Promise<string[]> {
    const bucket = admin.storage().bucket();
    const urls = [];

    for (const file of files) {
      const fileExtension = path.extname(file.originalname);
      const fileName = path.basename(file.originalname, fileExtension);
      const destinationPath = `${fileName}${fileExtension}`;

      const [fileUpload] = await bucket.upload(file.path, {
        destination: destinationPath,
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: 'unique-download-token'
          }
        }
      });

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destinationPath)}?alt=media&token=unique-download-token`;
      
        const newCrudArchivoDto: CreateCrudArchivoDto = {
          nombre: fileName,
          fecha: new Date(), 
          url: publicUrl,
          apunteId: id, 
        };
  
        await this.crudArchivoService.create(newCrudArchivoDto);

      urls.push(publicUrl);
    }

    return urls;
  }
}