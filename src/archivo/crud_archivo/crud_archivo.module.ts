import { Module } from '@nestjs/common';
import { CrudArchivoService } from './crud_archivo.service';
import { CrudArchivoController } from './crud_archivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrudArchivo } from './entities/crud_archivo.entity';
import { ApunteModule } from 'src/apunte/apunte.module';

@Module({
  imports:[TypeOrmModule.forFeature([CrudArchivo]),ApunteModule],
  controllers: [CrudArchivoController],
  providers: [CrudArchivoService],
  exports:[CrudArchivoService]
})
export class CrudArchivoModule {}
