import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApuntecompartidoService } from './apuntescompartido.service';
import { UpdateApuntescompartidoDto } from './dto/update-apuntescompartido.dto';
import { CreateApunteCompartidoDto } from './dto/create-apuntecompartido.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ApuntesCompartido')
@Controller('apuntescompartido')
export class ApuntecompartidoController {
  constructor(
    private readonly apuntescompartidoService: ApuntecompartidoService,
  ) {}

  @Post()
  async create(@Body() createApuntescompartidoDto: CreateApunteCompartidoDto) {
    try {
      return await this.apuntescompartidoService.create(
        createApuntescompartidoDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear el apunte compartido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.apuntescompartidoService.findAll();
    } catch (error) {
      throw new HttpException(
        'Error al obtener los apuntes compartidos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const apunte = await this.apuntescompartidoService.findOne(+id);
      if (!apunte) {
        throw new HttpException(
          'Apunte compartido no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      return apunte;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener el apunte compartido',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(@Param('usuarioId') usuarioId: string) {
    try {
      return await this.apuntescompartidoService.findByUsuario(+usuarioId);
    } catch (error) {
      throw new HttpException(
        'Error al obtener los apuntes del usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApuntescompartidoDto: UpdateApuntescompartidoDto,
  ) {
    try {
      const apunteActualizado = await this.apuntescompartidoService.update(
        +id,
        updateApuntescompartidoDto,
      );
      if (!apunteActualizado) {
        throw new HttpException(
          'Apunte compartido no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      return apunteActualizado;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar el apunte compartido',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const apunte = await this.apuntescompartidoService.findOne(+id);
      if (!apunte) {
        throw new HttpException(
          'Apunte compartido no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.apuntescompartidoService.remove(+id);
      return {
        message: 'Apunte compartido eliminado correctamente',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al eliminar el apunte compartido',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/email/:email')
  async getApunCompByUser(@Param('email') email: string) {
    try {
      const apuntes =
        await this.apuntescompartidoService.getApunCompByUser(email);
      return {
        success: true,
        data: apuntes,
        message: 'Apuntes compartidos obtenidos exitosamente',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener los apuntes compartidos',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
