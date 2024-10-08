import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CrudArchivoService } from './crud_archivo.service';
import { CreateCrudArchivoDto } from './dto/create-crud_archivo.dto';
import { UpdateCrudArchivoDto } from './dto/update-crud_archivo.dto';
import { CrudArchivo } from './entities/crud_archivo.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('crud-archivo')
export class CrudArchivoController {
  constructor(private readonly crudArchivoService: CrudArchivoService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCrudArchivoDto: CreateCrudArchivoDto): Promise<CrudArchivo> {
    return this.crudArchivoService.create(createCrudArchivoDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll():Promise<CrudArchivo[]> {
    return this.crudArchivoService.findAll();
  }

  @Get('apunte/:apunteId')
  @UseGuards(AuthGuard)
  async findByApunte(@Param('apunteId') apunteId: number) {
    return this.crudArchivoService.findByApunte(apunteId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string):Promise<CrudArchivo> {
    return this.crudArchivoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateCrudArchivoDto: UpdateCrudArchivoDto):Promise<CrudArchivo>{
    return this.crudArchivoService.update(+id, updateCrudArchivoDto);
  }

  @Delete(':id')
   @UseGuards(AuthGuard)
  remove(@Param('id') id: string):Promise<void> {
    return this.crudArchivoService.remove(+id);
  }
}
