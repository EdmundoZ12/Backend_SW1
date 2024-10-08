import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Materia } from './entities/materia.entity'; // Asegúrate de importar la entidad Materia
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Materia') 
@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createMateriaDto: CreateMateriaDto): Promise<Materia> {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(): Promise<Materia[]> {
    return this.materiaService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number): Promise<Materia> {
    return this.materiaService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() updateMateriaDto: UpdateMateriaDto): Promise<Materia> {
    return this.materiaService.update(id, updateMateriaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.materiaService.remove(id);
  }
}
