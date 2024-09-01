import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';


@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post('register')
  register(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      return this.usuarioService.register(createUsuarioDto);
    } catch (e) {
      throw new HttpException('failed to retrive Users', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    try {
      return this.usuarioService.findAll();
    } catch (e) {
      throw new HttpException('failed to retrive User', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    try {
      const user = this.usuarioService.findOne(+id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (e) {
      throw new HttpException('failed to retrive User', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const user = this.usuarioService.findOne(+id);
      if (!user) {
        throw new HttpException('User not foud', HttpStatus.NOT_FOUND);
      }
      return this.usuarioService.update(+id, updateUsuarioDto);
    } catch (e) {
      throw new HttpException('failed to retrive User', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    try {
      const user = await this.usuarioService.findOne(+id);
      if (!user) {
        throw new HttpException('User not foud', HttpStatus.NOT_FOUND);
      }
      await this.usuarioService.remove(+id);
      return { message: 'User deleted successfully' };
    } catch (e) {
      throw new HttpException('failed to retrive User', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
