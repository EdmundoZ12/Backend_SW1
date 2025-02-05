// auth.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) { }

  async login({ email, password }: LoginUsuarioDto) {
    try {
      const usuario = await this.usuarioService.getUsuariobyEmail(email);

      if (!usuario) {
        throw new UnauthorizedException('email is wrong');
      }

      const ispasswordValid = await bcrypt.compare(password, usuario.password);
      if (!ispasswordValid) {
        throw new UnauthorizedException('email is wrong');
      }

      const payload = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        payload,
        token,
      };
    } catch (e) {
      throw new HttpException(
        'failed to retrieve Users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  checkToken(usuario) {
    const payload = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
    };

    const token = this.jwtService.sign(payload);

    return {
      payload,
      token,
    };
  }

  checkEmailByToken(usuario) {
    const payload = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
    };

    return {
      payload
    };
  }
  
  async updateTokenDevice(email: string, tokenDevice: string | null) {
    try {
      const usuario = await this.usuarioService.getUsuariobyEmail(email);

      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      const deviceTokenToUpdate =
        tokenDevice === null ? usuario.tokenDevice : tokenDevice;

      // Actualizar el tokenDevice solo si es diferente al actual
      if (deviceTokenToUpdate !== usuario.tokenDevice) {
        await this.usuarioService.update(usuario.id, {
          tokenDevice: deviceTokenToUpdate === '' ? null : deviceTokenToUpdate,
        });
      }

      return {
        success: true,
        message: 'Token device actualizado correctamente',
        tokenDevice: deviceTokenToUpdate,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar el token device',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
