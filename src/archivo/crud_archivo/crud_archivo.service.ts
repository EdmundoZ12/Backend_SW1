import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCrudArchivoDto } from './dto/create-crud_archivo.dto';
import { UpdateCrudArchivoDto } from './dto/update-crud_archivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudArchivo } from './entities/crud_archivo.entity';
import { Repository } from 'typeorm';
import { ApunteService } from 'src/apunte/apunte.service';

@Injectable()
export class CrudArchivoService {

  constructor(
    @InjectRepository(CrudArchivo)
    private readonly archivoRepository:Repository<CrudArchivo>,
    private apunteService:ApunteService,
    
  ){}

  async create(createCrudArchivoDto: CreateCrudArchivoDto) {
    const apunte = await this.apunteService.findOne(
      createCrudArchivoDto.apunteId
    );
    if(!apunte){
      throw new HttpException('apunte not found',HttpStatus.NOT_FOUND)
    }
    const archivo = this.archivoRepository.create({
      nombre:createCrudArchivoDto.nombre,
      fecha:createCrudArchivoDto.fecha,
      url:createCrudArchivoDto.url,
      apunte:apunte,
    });
    return this.archivoRepository.save(archivo);
  }

  async findAll(): Promise<CrudArchivo[]> {
    return this.archivoRepository.find({
      relations: ['apunte'], // Incluimos la relación con Apunte
    });
  }

  async findByApunte(apunteId: number): Promise<CrudArchivo[]> {
    // Buscamos todos los archivos relacionados con el apunteId específico
    return this.archivoRepository.find({
      where: { apunte: { id: apunteId } }, // Filtramos por el id del apunte
      relations: ['apunte'], // Incluimos la relación con Apunte
    });
  }
  

  async findOne(id: number): Promise<CrudArchivo> {
    return this.archivoRepository.findOne({
      where: { id: id },
      relations: ['apunte'], // Incluimos la relación con Apunte
    });
  }
  

  async update(id: number, updateCrudArchivoDto: UpdateCrudArchivoDto):Promise<CrudArchivo> {
   await this.archivoRepository.update(id,updateCrudArchivoDto);
   return this.archivoRepository.findOneBy({id:id});
  }

  async remove(id: number): Promise<void> {
    await this.archivoRepository.delete(id);
  }
}
