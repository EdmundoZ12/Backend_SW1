import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TemaService } from './tema.service';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';

@Controller('tema')
export class TemaController {
  constructor(private readonly temaService: TemaService) {}

  @Post()
  createTema(@Body() createTemaDto: CreateTemaDto) {
    return this.temaService.createTema(createTemaDto);
  }

  @Get('/temas-raices/:id')
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.temaService.findAllByMateria(id);
  }

  @Get('/subtemas/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.temaService.findOneWithSubTemas(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemaDto: UpdateTemaDto) {
    return this.temaService.update(+id, updateTemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temaService.remove(+id);
  }
}
